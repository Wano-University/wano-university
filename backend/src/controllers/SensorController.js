import prisma from '../config/db.js';

export const registerSensor = async (req, res) => {
  try {
    const { type, floor, space, resourceId, mobilityResourceId, alertLimit, isActive, xCoordinates, yCoordinates } = req.body;

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
      data: { type, floor, space, resourceId, mobilityResourceId, alertLimit, isActive, xCoordinates, yCoordinates}
    });

    res.status(201).json(sensor);
  } catch (error) {
    console.error("Error registering sensor:", error);
    res.status(400).json({ error: "Failed to register sensor." });
  }
};

export const getSensorsByfloor = async (req, res) =>{
  try {
    const { floor } = req.params;
    const sensors = await prisma.sensor.findMany({
      where: {floor: floor }});
    res.status(200).json(sensors);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch sensors by floor." });
  }
}

export const sensorStatus = async (req, res) => {
  try{
    const {id} = req.params;
    const {isActive} = req.body;

    const updatedSensor = await prisma.sensor.update({
      where: { id: parseInt(id) },
      data: { isActive }
    });
    res.status(200).json(updatedSensor);
  } catch (error) {
    res.status(400).json({ error: "Failed to update status." });
  }
};

export const getAllActiveSensors = async(req, res)=>{
  try {
    const sensors = await prisma.sensor.findMany({ 
      where: { isActive: true } });

      res.status(200).json(sensors);
  }catch (error){
    res.status(500).json({ error: "Failed to fetch active sensors."})
  }
};

export const getAllActiveSensorsByFloor = async(req, res)=>{
  try {
    const sensors = await prisma.sensor.findMany({ 
      where: { isActive: true },
      orderBy: {floor: 'asc'}});

      res.status(200).json(sensors);
  }catch (error){
    res.status(500).json({ error: "Failed to fetch active sensors."})
  }
};

export const getAllActiveSensorsByType = async(req, res)=>{
  try {
    const {isActive} = req.body;
    const { type } = req.params;
    const sensors = await prisma.sensor.findMany({ 
      where: { isActive: true, type: type } });

      res.status(200).json(sensors);
  }catch (error){
    res.status(500).json({ error: "Failed to fetch active sensors."})
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

export const getAlerts = async (req, res) => {
  try {
    const { id } = req.query; 
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
    const { id } = req.query;
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
