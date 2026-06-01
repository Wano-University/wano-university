import prisma from '../config/db.js';

export const registerSensor = async (req, res) => {
  try {
    const { type, resourceId, mobilityResourceId, alertLimit, isActive, xCoordinates, yCoordinates } = req.body;

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
      data: { type, resourceId, mobilityResourceId, alertLimit, isActive, xCoordinates, yCoordinates}
    });

    res.status(201).json(sensor);
  } catch (error) {
    console.error("Error registering sensor:", error);
    res.status(400).json({ error: "Failed to register sensor." });
  }
};

export const sensorStatus = async (req, res) => {
  try{
    const {id} = req.params;
    const {isActive} = req.params;

    const updatedSensor = await prisma.sensor.update({
      where: { id: parseInt(id) },
      data: { isActive }
    });
    res.status(200).json(updatedSensor);
  } catch (error) {
    res.status(400).json({ error: "Failed to update status." });
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
      where: {type: type }});

    res.status(200).json(sensors);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch sensors by type." });
  }
};

export const getAlerts = async (req, res) =>{
    try {
    const sensors = await prisma.sensor.findMany({
      where: { id: parseInt(id) },
      include: { alerts: true}
    });
    res.status(200).json(sensors);
  } catch (error) {
    res.status(500).json({ error: "Failed to load alerts." });
  }
};

export const getReadings = async (req, res) =>{
    try {
    const sensors = await prisma.sensor.findMany({
      where: { id: parseInt(id) },
      include: { readings: true}
    });
    res.status(200).json(sensors);
  } catch (error) {
    res.status(500).json({ error: "Failed to load readings." });
  }
};

export const getAllAlerts = async (req, res) =>{
    try {
    const sensors = await prisma.sensor.findMany({
        include : {alerts: true}
    });
    res.status(200).json(sensors);
  } catch (error) {
    res.status(500).json({ error: "Failed to load alerts." });
  }
};

export const getAllReadings = async (req, res) =>{
    try {
    const sensors = await prisma.sensor.findMany({
        include : {readings: true}
    });
    res.status(200).json(sensors);
  } catch (error) {
    res.status(500).json({ error: "Failed to load readings." });
  }
};
