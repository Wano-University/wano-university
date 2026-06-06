import prisma from '../config/db.js';
import { Parser } from 'json2csv'; 

export const exportTemperatureReport = async (req, res) => {
  try {
    const now = new Date();
    const endOfWindow = new Date(); 
    const startOfWindow = new Date();
    startOfWindow.setUTCDate(endOfWindow.getUTCDate() - 30);

    const readings = await prisma.sensorReading.findMany({
      where: {
        readingDate: {
          gte: startOfWindow,
          lte: endOfWindow
        },
        sensor: { type: "TEMPERATURE" }
      },
      include: {
        sensor: true
      },
      orderBy: { readingDate: 'desc' }
    });

    if (readings.length === 0) {
      return res.status(404).json({ error: "No sensor readings found for the current month." });
    }
    
    let csvContent = "Reading ID,Sensor ID,Temperature (°C),Date,Time,Status\n";
    readings.forEach(reading => { 
      const dateObj = new Date(reading.readingDate);
      const dateString = dateObj.toLocaleDateString();
      const timeString = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      const status = reading.value > 26 ? "High Spikes" : reading.value < 16 ? "Low Spikes" : "Normal";

      csvContent += `${reading.id},${reading.sensorId},${reading.value},${dateString},${timeString},${status}\n`;
    });

    const filename = `temperature_report_${now.getFullYear()}_${now.getMonth() + 1}.csv`;
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    
    return res.status(200).send(csvContent);

  } catch (err) {
    console.error("Export handler error:", err);
    return res.status(500).json({ error: "Failed to generate report" });
  }
};

export const getTemperatureSimulation = async (req, res) => {
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

      await prisma.sensor.createMany({
        data: newSensors,
        skipDuplicates: true
      });

      sensors = await prisma.sensor.findMany({
        where: { type: "TEMPERATURE", isActive: true },
        orderBy: { id: 'asc' }
      });
    }

    const readings = sensors.map(sensor => ({
      sensorId: sensor.id,
      value: Math.floor(Math.random() * (28 - 15 + 1) + 15),
      readingDate: new Date(),
    }));

    await prisma.sensorReading.createMany({ data: readings });

    const now = new Date();
    const fifteenMinutesAgo = new Date(now.getTime() - (15 * 60 * 1000));

    const historicalReadings = await prisma.sensorReading.findMany({
      where: {
        readingDate: { gte: fifteenMinutesAgo.toISOString() },
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

      if (!minuteGroups[minuteKey]) {
        minuteGroups[minuteKey] = { sum: 0, count: 0 };
      }
      minuteGroups[minuteKey].sum += reading.value;
      minuteGroups[minuteKey].count += 1;
    });

    const chartData = Object.keys(minuteGroups)
      // 1. Sort the keys chronologically (oldest to newest)
      .sort((a, b) => new Date(a) - new Date(b)) 
      // 2. Map to the final array
      .map(key => ({
        hour: new Date(key).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), 
        temperature: Math.round(minuteGroups[key].sum / minuteGroups[key].count)
      }))
      .slice(-10); // Keep the last 10 sorted entries

    const currentSnapshotValues = readings.map(r => r.value);
    
    const minCalculated = currentSnapshotValues.length > 0 ? Math.min(...currentSnapshotValues) : 0;
    const maxCalculated = currentSnapshotValues.length > 0 ? Math.max(...currentSnapshotValues) : 0;
    const avgCalculated = currentSnapshotValues.length > 0 ? Math.round(currentSnapshotValues.reduce((a, b) => a + b, 0) / currentSnapshotValues.length) : 0;
   
    return res.json({
      sensors: readings.map(r => {
        const originalSensor = sensors.find(s => s.id === r.sensorId);
        return { 
          id: r.sensorId, 
          temp: r.value, 
          lowerLimit: originalSensor?.lowerLimit ?? null, 
          upperLimit: originalSensor?.upperLimit ?? null 
        };
      }),
      stats: [
        { title: "Minimum Temperature", value: `${minCalculated}°C` },
        { title: "Average Temperature", value: `${avgCalculated}°C` },
        { title: "Maximum Temperature", value: `${maxCalculated}°C` }
      ],
      chartData 
    });

  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const updateTempSensorLimits = async (req, res) => {
  const { id } = req.params;
  const { lowest, highest } = req.body;

  try {
    const min = lowest !== "" ? parseFloat(lowest) : null;
    const max = highest !== "" ? parseFloat(highest) : null;

    const updatedSensor = await prisma.sensor.update({
      where: { id: parseInt(id) },
      data: {
        lowerLimit: min,
        upperLimit: max,
      },
    });

    return res.status(200).json({ message: "Limits updated successfully!", updatedSensor });
  } catch (err) {
    return res.status(500).json({ error: "Failed to update sensor limits" });
  }
};