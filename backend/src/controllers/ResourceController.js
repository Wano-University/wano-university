import prisma from '../config/db.js';

export const getResources = async (req, res) => {
  try {
    const resources = await prisma.resource.findMany({
      include: { sensor: true, reservations: true, accesses: true }
    });

    res.status(200).json(resources);
  } catch (error) {
    console.error("Error fetching resources:", error);
    res.status(500).json({ error: "Error loading the resources." });
  }
};

export const registerResource = async (req, res) => {
  try {
    const { type, name, capacity, isAvailable, createdAt } = req.body;

    const resource = await prisma.resource.create({
      data: { type, name, capacity, isAvailable, createdAt }
    });

    res.status(201).json(resource);
  } catch (error) {
    console.error("Error registering resource:", error);
    res.status(400).json({ error: "Failed to register resource." });
  }
};

export const getResourcesByfloor = async (req, res) => {
  try {
    const { floor } = req.params;
    const resources = await prisma.resource.findMany({
      where: {
        sensor: {
          floor: floor
        }
      },
      include: { sensor: true }
    });
    res.status(200).json(resources);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch resources by floor." });
  }
};

export const resourceStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isAvailable } = req.body; 

    const updatedResource = await prisma.resource.update({
      where: { id: parseInt(id) },
      data: { isAvailable }
    });
    res.status(200).json(updatedResource);
  } catch (error) {
    res.status(400).json({ error: "Failed to update status." });
  }
};

export const getResourcesByType = async (req, res) => {
  try {
    const { type } = req.params;
    const resources = await prisma.resource.findMany({
      where: { type: type }
    });

    res.status(200).json(resources);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch resources by type." });
  }
};

export const getReservations = async (req, res) => {
  try {
    const { id } = req.query; 
    const resources = await prisma.resource.findUnique({
      where: { id: parseInt(id) },
      include: { reservations: true }
    });
    res.status(200).json(resources ? resources.reservations : []);
  } catch (error) {
    res.status(500).json({ error: "Failed to load reservations." });
  }
};

export const getAccesses = async (req, res) => {
  try {
    const { id } = req.query;
    const resources = await prisma.resource.findUnique({
      where: { id: parseInt(id) },
      include: { accesses: true }
    });
    res.status(200).json(resources ? resources.accesses : []);
  } catch (error) {
    res.status(500).json({ error: "Failed to load accesses." });
  }
};

export const getAllReservations = async (req, res) => {
  try {
    const resources = await prisma.resource.findMany({
      include: { reservations: true }
    });
    res.status(200).json(resources);
  } catch (error) {
    res.status(500).json({ error: "Failed to load reservations." });
  }
};

export const getAllAccesses = async (req, res) => {
  try {
    const resources = await prisma.resource.findMany({
      include: { accesses: true }
    });
    res.status(200).json(resources);
  } catch (error) {
    res.status(500).json({ error: "Failed to load accesses." });
  }
};