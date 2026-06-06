import prisma from '../config/db.js';

export const exportEnergyReport = async (req, res) => {
  try {
    const endOfWindow = new Date(); 
    const startOfWindow = new Date();
    startOfWindow.setUTCDate(endOfWindow.getUTCDate() - 30);

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
    readings.forEach(reading => { 
      const dateObj = new Date(reading.readingDate);
      const dateString = dateObj.toLocaleDateString();
      const timeString = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      const status = reading.value > 1500 ? "High Spikes" : reading.value < 100 ? "Low Spikes" : "Normal";
      csvContent += `${reading.id},${reading.sensorId},${reading.value},${dateString},${timeString},${status}\n`;
    });

    const filename = `EnergyConsumption_report_${endOfWindow.getFullYear()}_${endOfWindow.getMonth() + 1}.csv`;
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    return res.status(200).send(csvContent);
  } catch (err) {
    console.error("Export handler error:", err);
    return res.status(500).json({ error: "Failed to generate report" });
  }
};

export const getEnergySimulation = async (req, res) => {
  try {
    // Fetch Sensors
    let sensors = await prisma.sensor.findMany({ 
      where: { type: "ENERGY_CONSUMPTION", isActive: true }, 
      orderBy: { id: 'asc' } 
    });


    // Insert new readings (simulate)
    const newReadings = sensors.map(sensor => ({
      sensorId: sensor.id,
      value: Math.floor(Math.random() * 500) + 100,
      readingDate: new Date()
    }));
    await prisma.sensorReading.createMany({ data: newReadings });

    const twentyFourHoursAgo = new Date(Date.now() - (24 * 60 * 60 * 1000));
    
    const energySensorIds = sensors.map(s => s.id);

    const todayTotalResult = await prisma.sensorReading.aggregate({
        _sum: { value: true },
        where: {
            sensorId: { in: energySensorIds },
            readingDate: { gte: twentyFourHoursAgo }
        }
    });

    // Get Chart Data (Last 24 hours of readings)
    const thirtyDaysAgo = new Date(Date.now() - (30 * 24 * 60 * 60 * 1000));
   const historical = await prisma.sensorReading.findMany({
    where: { 
        sensorId: { in: energySensorIds },
        readingDate: { gte: thirtyDaysAgo }
    },
    orderBy: { readingDate: 'asc' }
    });

    const dailyGroups = historical.reduce((acc, curr) => {
      const dateKey = new Date(curr.readingDate).toISOString().split('T')[0];
      if (!acc[dateKey]) {
        acc[dateKey] = { total: 0, count: 0 };
      }
      acc[dateKey].total += curr.value;
      acc[dateKey].count += 1;
      return acc;
    }, {});

    const chartData = Object.keys(dailyGroups).map(date => ({
      time: date,
      power: Math.round(dailyGroups[date].total / dailyGroups[date].count)
    }));

    // 6. Find Peak
    const startOfToday = new Date();
    startOfToday.setUTCHours(0, 0, 0, 0);
    const peakReading = await prisma.sensorReading.findFirst({
    where: { 
        sensorId: { in: energySensorIds },
        readingDate: { gte: twentyFourHoursAgo }
    },
    orderBy: { value: 'desc' }
});
    return res.json({
  sensors: newReadings.map(r => {
    const originalSensor = sensors.find(s => s.id === r.sensorId);
    return { 
      id: r.sensorId, 
      val: r.value,
      lowerLimit: originalSensor?.lowerLimit ?? null,
      upperLimit: originalSensor?.upperLimit ?? null 
    };
  }),
  totalPower: `${Math.round(todayTotalResult._sum.value || 0)} W`,
  peak: { 
    sensorId: peakReading?.sensorId || "N/A", 
    value: peakReading?.value || 0 
  },
  chartData: chartData
});

  } catch (err) {
    console.error("Simulation error:", err);
    return res.status(500).json({ error: err.message });
  }
};

export const updateEnergySensorLimits = async (req, res) => {
  const { id } = req.params;
  const { lowerLimit, upperLimit } = req.body;

  try {
    const updatedSensor = await prisma.sensor.update({
      where: { id: parseInt(id) },
      data: {
        lowerLimit: lowerLimit !== null ? parseFloat(lowerLimit) : null,
        upperLimit: upperLimit !== null ? parseFloat(upperLimit) : null,
      },
    });

    return res.status(200).json({ message: "Limits updated successfully!", updatedSensor });
  } catch (err) {
    console.error("Update error:", err);
    return res.status(500).json({ error: "Failed to update sensor limits" });
  }
};