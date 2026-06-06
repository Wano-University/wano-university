import prisma from '../config/db.js';

export const getAirQualitySimulation = async (req, res) => {
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
        sensors = await prisma.sensor.findMany({ 
          where: { type: "AIR_QUALITY", isActive: true }, 
          orderBy: { id: 'asc' } 
        });
    }
    
    const newReadings = sensors.map(s => ({
      sensorId: s.id,
      value: Math.floor(Math.random() * (150 - 20 + 1) + 20), 
      readingDate: new Date()
    }));

    await prisma.sensorReading.createMany({ data: newReadings });

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

    return res.json({
      sensors: sensorData,
      stats: [
        { title: "Average PM2.5", value: `${Math.round(avgIqa / 10)} µg/m³` },
        { title: "Average IQA", value: avgIqa.toString() },
        { title: "Good IQA", value: `${goodSensors} / ${sensorData.length}` },
        { title: "Worst IQA", value: `Sensor ${sensorData.sort((a,b) => b.iqa - a.iqa)[0].id}` }
      ]
    });
  } catch (err) {
    console.error("Live Simulation Error:", err);
    res.status(500).json({ error: "Failed" });
  }
};

export const updateAirQualitySensorLimits = async (req, res) => {
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

    console.log(`✅ Limits updated for Air Quality Sensor ${id}`);
    return res.status(200).json({ message: "Limits updated!", updatedSensor });
  } catch (err) {
    console.error("Database update error:", err);
    return res.status(500).json({ error: "Failed to update sensor limits" });
  }
};

export const exportAirQualityReport = async (req, res) => {
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
        sensor: { type: "AIR_QUALITY" }
      },
      include: {
        sensor: true
      },
      orderBy: { readingDate: 'desc' }
    });

    if (readings.length === 0) {
      return res.status(404).json({ error: "No sensor readings found for the current month." });
    }
    
    let csvContent = "Reading ID,Sensor ID,Air Quality Index,Date,Time,Status\n";
    readings.forEach(reading => { 
      const dateObj = new Date(reading.readingDate);
      const dateString = dateObj.toLocaleDateString();
      const timeString = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      const status = reading.value > 100 ? "High Pollution" : reading.value < 50 ? "Good" : "Moderate";

      csvContent += `${reading.id},${reading.sensorId},${reading.value},${dateString},${timeString},${status}\n`;
    });

    const filename = `air_quality_report_${now.getFullYear()}_${now.getMonth() + 1}.csv`;
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    
    return res.status(200).send(csvContent);

  } catch (err) {
    console.error("Export handler error:", err);
    return res.status(500).json({ error: "Failed to generate report" });
  }
};