import prisma from '../config/db.js';

export const exportAirQualityReport = async (req, res) => {
  try {
    const endOfWindow = new Date();
    const startOfWindow = new Date(Date.now() - (30 * 24 * 60 * 60 * 1000));

    const readings = await prisma.sensorReading.findMany({
      where: {
        readingDate: { gte: startOfWindow, lte: endOfWindow },
        sensor: { type: "AIR_QUALITY" }
      },
      include: { sensor: true },
      orderBy: { readingDate: 'desc' }
    });

    if (readings.length === 0) {
      return res.status(404).json({ error: "No sensor readings found for the current month." });
    }

    let csvContent = "Reading ID,Sensor ID,Air Quality Index,Date,Time,Status\n";
    readings.forEach(({ id, sensorId, value, readingDate, sensor }) => {
      const dateString = readingDate.toISOString().split('T')[0];
      const timeString = readingDate.toISOString().split('T')[1].split('.')[0];

      let status = "Moderate";
      if (sensor.upperLimit !== null && value > sensor.upperLimit) status = "High Pollution";
      else if (sensor.lowerLimit !== null && value < sensor.lowerLimit) status = "Good";

      csvContent += `${id},${sensorId},${value},${dateString},${timeString},${status}\n`;
    });

    const filename = `air_quality_report_${endOfWindow.toISOString().slice(0, 7)}.csv`;
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    return res.status(200).send(csvContent);

  } catch (err) {
    console.error("Export handler error:", err);
    return res.status(500).json({ error: "Failed to generate report" });
  }
};

export const runAirQualitySimulation = async (req, res) => {
  try {
    let sensors = await prisma.sensor.findMany({
      where: { type: "AIR_QUALITY", isActive: true },
      orderBy: { id: 'asc' }
    });

    if (sensors.length < 6) {
      const needed = 6 - sensors.length;
      const newSensors = Array.from({ length: needed }).map((_, index) => ({
        type: "AIR_QUALITY",
        isActive: true,
        space: `Air Quality Zone ${index + 1}`,
        xCoordinates: 0.0,
        yCoordinates: 0.0
      }));
      await prisma.sensor.createMany({ data: newSensors });
      sensors = await prisma.sensor.findMany({ where: { type: "AIR_QUALITY", isActive: true }, orderBy: { id: 'asc' } });
    }

    const alertsToCreate = [];
    const newReadings = sensors.map(sensor => {
      const value = Math.floor(Math.random() * (150 - 20 + 1) + 20);

      if (sensor.upperLimit !== null && value > sensor.upperLimit) {
        alertsToCreate.push({
          sensorId: sensor.id,
          message: `High pollution: IQA ${value} exceeds upper limit of ${sensor.upperLimit}.`
        });
      } else if (sensor.lowerLimit !== null && value < sensor.lowerLimit) {
        alertsToCreate.push({
          sensorId: sensor.id,
          message: `Abnormally low IQA anomaly: ${value}.`
        });
      }

      return {
        sensorId: sensor.id,
        value,
        readingDate: new Date()
      };
    });

    await prisma.sensorReading.createMany({ data: newReadings });
    if (alertsToCreate.length > 0) {
      await prisma.sensorAlert.createMany({ data: alertsToCreate });
    }

    // Prepare Frontend Payload
    const sensorData = newReadings.map(r => {
      const originalSensor = sensors.find(s => s.id === r.sensorId);
      return {
        id: r.sensorId,
        iqa: r.value,
        lowerLimit: originalSensor?.lowerLimit ?? null,
        upperLimit: originalSensor?.upperLimit ?? null
      };
    });

    const avgIqa = Math.round(sensorData.reduce((a, b) => a + b.iqa, 0) / sensorData.length);
    const goodSensors = sensorData.filter(s => s.iqa <= 50).length;
    const sortedByWorst = [...sensorData].sort((a, b) => b.iqa - a.iqa);

    return res.status(200).json({
      sensors: sensorData,
      alertsGenerated: alertsToCreate.length,
      stats: [
        { title: "Average PM2.5", value: `${Math.round(avgIqa / 10)} µg/m³` },
        { title: "Average IQA", value: avgIqa.toString() },
        { title: "Good IQA", value: `${goodSensors} / ${sensorData.length}` },
        { title: "Worst IQA", value: `Sensor ${sortedByWorst[0]?.id || 'N/A'}` }
      ]
    });
  } catch (err) {
    console.error("Live Simulation Error:", err);
    return res.status(500).json({ error: "Failed to run simulation." });
  }
};

export const updateAirQualitySensorLimits = async (req, res) => {
  try {
    const { id } = req.params;
    const { lowerLimit, upperLimit } = req.body;

    const updatedSensor = await prisma.sensor.update({
      where: { id: parseInt(id) },
      data: {
        lowerLimit: lowerLimit !== undefined ? parseFloat(lowerLimit) : null,
        upperLimit: upperLimit !== undefined ? parseFloat(upperLimit) : null,
      },
    });

    return res.status(200).json(updatedSensor);
  } catch (err) {
    console.error("Update error:", err);
    return res.status(500).json({ error: "Failed to update sensor limits." });
  }
};
