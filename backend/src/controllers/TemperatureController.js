import prisma from '../config/db.js';

export const exportTemperatureReport = async (req, res) => {
  try {
    const endOfWindow = new Date();
    const startOfWindow = new Date(Date.now() - (30 * 24 * 60 * 60 * 1000));

    const readings = await prisma.sensorReading.findMany({
      where: {
        readingDate: { gte: startOfWindow, lte: endOfWindow },
        sensor: { type: "TEMPERATURE" }
      },
      include: { sensor: true },
      orderBy: { readingDate: 'desc' }
    });

    if (readings.length === 0) {
      return res.status(404).json({ error: "No sensor readings found for the current month." });
    }

    let csvContent = "Reading ID,Sensor ID,Temperature (°C),Date,Time,Status\n";
    readings.forEach(({ id, sensorId, value, readingDate, sensor }) => {
      const dateString = readingDate.toISOString().split('T')[0];
      const timeString = readingDate.toISOString().split('T')[1].split('.')[0];

      let status = "Normal";
      if (sensor.upperLimit !== null && value > sensor.upperLimit) status = "High Spikes";
      else if (sensor.lowerLimit !== null && value < sensor.lowerLimit) status = "Low Spikes";

      csvContent += `${id},${sensorId},${value},${dateString},${timeString},${status}\n`;
    });

    const filename = `temperature_report_${endOfWindow.toISOString().slice(0, 7)}.csv`;
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    return res.status(200).send(csvContent);

  } catch (err) {
    console.error("Export handler error:", err);
    return res.status(500).json({ error: "Failed to generate report" });
  }
};

export const runTemperatureSimulation = async (req, res) => {
  try {
    let sensors = await prisma.sensor.findMany({
      where: { type: "TEMPERATURE", isActive: true },
      orderBy: { id: 'asc' }
    });

    if (sensors.length === 0) {
      const needed = 6 - sensors.length;
      const newSensors = Array.from({ length: needed }).map((_, index) => ({
        type: "TEMPERATURE",
        isActive: true,
        space: `Temp Zone ${index + 1}`,
        xCoordinates: 0.0,
        yCoordinates: 0.0
      }));
      await prisma.sensor.createMany({ data: newSensors });
      sensors = await prisma.sensor.findMany({ where: { type: "TEMPERATURE", isActive: true }, orderBy: { id: 'asc' } });
    }

    const alertsToCreate = [];
    const newReadings = sensors.map(sensor => {
      const value = Math.floor(Math.random() * (28 - 15 + 1) + 15); // Generate Temp 15°C - 28°C

      // Evaluate Alerts
      if (sensor.upperLimit !== null && value > sensor.upperLimit) {
        alertsToCreate.push({
          sensorId: sensor.id,
          message: `High temperature warning: ${value}°C exceeds upper limit of ${sensor.upperLimit}°C.`
        });
      } else if (sensor.lowerLimit !== null && value < sensor.lowerLimit) {
        alertsToCreate.push({
          sensorId: sensor.id,
          message: `Low temperature warning: ${value}°C drops below limit of ${sensor.lowerLimit}°C.`
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

    const fifteenMinutesAgo = new Date(Date.now() - (15 * 60 * 1000));
    const historicalReadings = await prisma.sensorReading.findMany({
      where: {
        readingDate: { gte: fifteenMinutesAgo },
        sensor: { type: "TEMPERATURE" }
      },
      select: { value: true, readingDate: true },
      orderBy: { readingDate: 'asc' }
    });

    const minuteGroups = {};
    historicalReadings.forEach(reading => {
      const date = new Date(reading.readingDate);
      date.setSeconds(0, 0);
      const minuteKey = date.toISOString();

      if (!minuteGroups[minuteKey]) minuteGroups[minuteKey] = { sum: 0, count: 0 };
      minuteGroups[minuteKey].sum += reading.value;
      minuteGroups[minuteKey].count += 1;
    });

    const chartData = Object.keys(minuteGroups)
      .sort((a, b) => new Date(a) - new Date(b))
      .map(key => ({
        hour: new Date(key).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        temperature: Math.round(minuteGroups[key].sum / minuteGroups[key].count)
      }))
      .slice(-10);

    const currentSnapshotValues = newReadings.map(r => r.value);
    const minCalculated = currentSnapshotValues.length > 0 ? Math.min(...currentSnapshotValues) : 0;
    const maxCalculated = currentSnapshotValues.length > 0 ? Math.max(...currentSnapshotValues) : 0;
    const avgCalculated = currentSnapshotValues.length > 0 ? Math.round(currentSnapshotValues.reduce((a, b) => a + b, 0) / currentSnapshotValues.length) : 0;

    return res.status(200).json({
      sensors: newReadings.map(r => {
        const originalSensor = sensors.find(s => s.id === r.sensorId);
        return {
          id: r.sensorId,
          temp: r.value,
          lowerLimit: originalSensor?.lowerLimit ?? null,
          upperLimit: originalSensor?.upperLimit ?? null
        };
      }),
      alertsGenerated: alertsToCreate.length,
      stats: [
        { title: "Minimum Temperature", value: `${minCalculated}°C` },
        { title: "Average Temperature", value: `${avgCalculated}°C` },
        { title: "Maximum Temperature", value: `${maxCalculated}°C` }
      ],
      chartData
    });

  } catch (err) {
    console.error("Simulation error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const updateTempSensorLimits = async (req, res) => {
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

export const getTemperatureTrend = async (req, res) => {
  try {
    const twentyFourHoursAgo = new Date(Date.now() - (24 * 60 * 60 * 1000));

    const historicalReadings = await prisma.sensorReading.findMany({
      where: {
        readingDate: { gte: twentyFourHoursAgo },
        sensor: { type: "TEMPERATURE" }
      },
      select: { value: true, readingDate: true },
      orderBy: { readingDate: 'asc' }
    });

    const hourlyGroups = {};
    historicalReadings.forEach(reading => {
      const hour = reading.readingDate.toISOString().slice(0, 13);
      if (!hourlyGroups[hour]) hourlyGroups[hour] = { sum: 0, count: 0 };
      hourlyGroups[hour].sum += reading.value;
      hourlyGroups[hour].count += 1;
    });

    const chartData = Object.keys(hourlyGroups).map(hour => ({
      hour: hour.slice(11) + ":00",
      temperature: Math.round(hourlyGroups[hour].sum / hourlyGroups[hour].count)
    }));

    return res.status(200).json(chartData);
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch trend" });
  }
};
