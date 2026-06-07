import prisma from '../config/db.js';

export const registerSensor = async (req, res) => {
  try {
    const { type, floor, space, upperLimit, lowerLimit, isActive, xCoordinates, yCoordinates} = req.body;

    let UnityMeasure = "";
    switch (type) {
      case 'TEMPERATURE':
        UnityMeasure = 'ºC';
        break;
      case 'ENERGY_CONSUMPTION':
        UnityMeasure = 'W';
        break;
      case 'AIR_QUALITY':
        UnityMeasure = 'AQI';
        break;
    }

    const existingSensor = await prisma.sensor.findFirst({
      where: {
        xCoordinates,
        yCoordinates
      }
    });

    if (existingSensor) {
      return res.status(400).json({
        message: "A sensor already exists at these exact coordinates.",
        sensor: existingSensor
      });
    }

    const sensor = await prisma.sensor.create({
      data: { type, floor, space, upperLimit, lowerLimit, isActive, xCoordinates, yCoordinates, UnityMeasure }
    });

    res.status(201).json(sensor);
  } catch (error) {
    console.error("Error registering sensor:", error);
    res.status(400).json({ error: "Failed to register sensor." });
  }
};

export const getSensorsByfloor = async (req, res) => {
  try {
    const { floor } = req.params;
    const sensors = await prisma.sensor.findMany({
      where: { floor: floor }
    });
    res.status(200).json(sensors);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch sensors by floor." });
  }
}

export const sensorStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    const updatedSensor = await prisma.sensor.update({
      where: { id: parseInt(id) },
      data: { isActive }
    });
    res.status(200).json(updatedSensor);
  } catch (error) {
    res.status(400).json({ error: "Failed to update status." });
  }
};

export const getAllActiveSensors = async (req, res) => {
  try {
    const sensors = await prisma.sensor.findMany({
      where: { isActive: true }
    });

    res.status(200).json(sensors);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch active sensors." })
  }
};

export const getAllActiveSensorsByFloor = async (req, res) => {
  try {
    const sensors = await prisma.sensor.findMany({
      where: { isActive: true },
      orderBy: { floor: 'asc' }
    });

    res.status(200).json(sensors);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch active sensors." })
  }
};

export const getAllActiveSensorsByType = async (req, res) => {
  try {
    const { type } = req.params;

    const sensors = await prisma.sensor.findMany({
      where: {
        isActive: true,
        type: type
      }
    });

    res.status(200).json(sensors);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch active sensors." });
  }
};

export const getAllSensors = async (req, res) => {
  try {
    const sensors = await prisma.sensor.findMany();
    res.status(200).json(sensors);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch sensors." });
  }
};

export const getSensorsByType = async (req, res) => {
  try {
    const { type } = req.params;
    const sensors = await prisma.sensor.findMany({
      where: { type: type }
    });

    res.status(200).json(sensors);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch sensors by type." });
  }
};

export const getAlerts = async (req, res) => {
  try {
    const { id } = req.params;

    const sensors = await prisma.sensor.findMany({
      where: {
        id: parseInt(id)
      },
      include: {
        alerts: true
      }
    });

    return res.status(200).json(serializeBigInts(sensors));

  } catch (error) {
    return res.status(500).json({
      error: "Failed to load alerts."
    });
  }
};

export const getReadings = async (req, res) => {
  try {
    const { id } = req.params;

    const sensors = await prisma.sensor.findMany({
      where: {
        id: parseInt(id)
      },
      include: {
        readings: true
      }
    });

    return res.status(200).json(serializeBigInts(sensors));

  } catch (error) {
    return res.status(500).json({
      error: "Failed to load readings."
    });
  }
};

export const getAllAlerts = async (req, res) => {
  try {
    const sensors = await prisma.sensor.findMany({
      include: { alerts: true }
    });
    res.status(200).json(sensors);
  } catch (error) {
    res.status(500).json({ error: "Failed to load alerts." });
  }
};

export const getAllReadings = async (req, res) => {
  try {
    const sensors = await prisma.sensor.findMany({
      include: { readings: true }
    });
    res.status(200).json(sensors);
  } catch (error) {
    res.status(500).json({ error: "Failed to load readings." });
  }
};

export const getPendingAlerts = async (req, res) => {
  try {
    const alerts = await prisma.sensorAlert.findMany({
      where: {
        isResolved: false
      },
      include: {
        sensor: true
      },
      orderBy: {
        alertDate: 'desc'
      }
    });

    const serializedAlerts = alerts.map(alert => ({
      ...alert,
      id: alert.id.toString()
    }));

    return res.status(200).json(serializedAlerts);

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Failed to load alerts."
    });
  }
};

export const resolveAlert = async (req, res) => {
  try {
    const { id } = req.params;

    const alert = await prisma.sensorAlert.update({
      where: {
        id: BigInt(id)
      },
      data: {
        isResolved: true
      }
    });

    return res.status(200).json({
      ...alert,
      id: alert.id.toString()
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Failed to resolve alert."
    });
  }
};
