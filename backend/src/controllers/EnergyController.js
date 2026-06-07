import prisma from '../config/db.js';

export const exportEnergyReport = async (req, res) => {
  try {
    const endOfWindow = new Date();
    const startOfWindow = new Date(Date.now() - (30 * 24 * 60 * 60 * 1000));

    const readings = await prisma.sensorReading.findMany({
      where: {
        readingDate: { gte: startOfWindow, lte: endOfWindow },
        sensor: { type: "ENERGY_CONSUMPTION" }
      },
      include: { sensor: true },
      orderBy: { readingDate: 'asc' }
    });

    if (readings.length === 0) {
      return res.status(404).json({ error: "No sensor readings found." });
    }

    let csvContent = "Reading ID,Sensor ID,Energy Consumption (W),Date,Time,Status\n";

    readings.forEach(({ id, sensorId, value, readingDate, sensor }) => {
      const dateString = readingDate.toISOString().split('T')[0];
      const timeString = readingDate.toISOString().split('T')[1].split('.')[0];

      let status = "Normal";
      if (sensor.upperLimit !== null && value > sensor.upperLimit) status = "High Spikes";
      if (sensor.lowerLimit !== null && value < sensor.lowerLimit) status = "Low Spikes";

      csvContent += `${id},${sensorId},${value},${dateString},${timeString},${status}\n`;
    });

    const filename = `EnergyConsumption_report_${endOfWindow.toISOString().slice(0, 7)}.csv`;
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    return res.status(200).send(csvContent);

  } catch (err) {
    console.error("Export handler error:", err);
    return res.status(500).json({ error: "Failed to generate report." });
  }
};

export const runEnergySimulation = async (req, res) => {
  try {
    const sensors = await prisma.sensor.findMany({
      where: { type: "ENERGY_CONSUMPTION", isActive: true },
      orderBy: { id: 'asc' }
    });

    if (!sensors.length) {
      return res.status(404).json({ error: "No active energy sensors found." });
    }

    const alertsToCreate = [];
    const newReadings = sensors.map(sensor => {
      const value = Math.floor(Math.random() * 500) + 100;

      if (sensor.upperLimit !== null && value > sensor.upperLimit) {
        alertsToCreate.push({
          sensorId: sensor.id,
          message: `High spike: ${value}W exceeds upper limit of ${sensor.upperLimit}W.`
        });
      } else if (sensor.lowerLimit !== null && value < sensor.lowerLimit) {
        alertsToCreate.push({
          sensorId: sensor.id,
          message: `Low drop: ${value}W is below lower limit of ${sensor.lowerLimit}W.`
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

    const now = Date.now();
    const twentyFourHoursAgo = new Date(now - (24 * 60 * 60 * 1000));
    const thirtyDaysAgo = new Date(now - (30 * 24 * 60 * 60 * 1000));
    const energySensorIds = sensors.map(s => s.id);

    const todayTotalResult = await prisma.sensorReading.aggregate({
      _sum: { value: true },
      where: {
        sensorId: { in: energySensorIds },
        readingDate: { gte: twentyFourHoursAgo }
      }
    });

    const todayReadings = await prisma.sensorReading.findMany({
      where: {
        sensorId: { in: energySensorIds },
        readingDate: { gte: twentyFourHoursAgo }
      },
      orderBy: { readingDate: 'asc' }
    });

    const hourlyGroups = todayReadings.reduce((acc, curr) => {
      const hour = curr.readingDate.toISOString().slice(0, 13); // "2026-06-07T14"
      if (!acc[hour]) acc[hour] = { total: 0, count: 0 };
      acc[hour].total += curr.value;
      acc[hour].count += 1;
      return acc;
    }, {});

    const chartData = Object.keys(hourlyGroups).map(hour => ({
      time: hour.slice(11) + ":00", // "14:00"
      power: Math.round(hourlyGroups[hour].total / hourlyGroups[hour].count)
    }));

    const peakReading = await prisma.sensorReading.findFirst({
      where: {
        sensorId: { in: energySensorIds },
        readingDate: { gte: twentyFourHoursAgo }
      },
      orderBy: { value: 'desc' }
    });

    return res.status(200).json({
      sensors: newReadings.map(r => {
        const originalSensor = sensors.find(s => s.id === r.sensorId);
        return {
          id: r.sensorId,
          val: r.value,
          lowerLimit: originalSensor?.lowerLimit || null,
          upperLimit: originalSensor?.upperLimit || null
        };
      }),
      alertsGenerated: alertsToCreate.length,
      totalPower: `${Math.round(todayTotalResult._sum.value || 0)} W`,
      peak: {
        sensorId: peakReading?.sensorId || "N/A",
        value: peakReading?.value || 0
      },
      chartData
    });

  } catch (err) {
    console.error("Simulation error:", err);
    return res.status(500).json({ error: "Failed to run simulation." });
  }
};

export const updateEnergySensorLimits = async (req, res) => {
  try {
    const { id } = req.params;
    const { lowerLimit, upperLimit } = req.body;

    const updatedSensor = await prisma.sensor.update({
      where: { id: parseInt(id) },
      data: {
        lowerLimit: lowerLimit !== undefined ? parseFloat(lowerLimit) : null,
        upperLimit: upperLimit !== undefined ? parseFloat(upperLimit) : null
      },
    });

    return res.status(200).json(updatedSensor);
  } catch (err) {
    console.error("Update error:", err);
    return res.status(500).json({ error: "Failed to update sensor limits." });
  }
};
