import prisma from '../config/db.js';

const VALID_SPACES = [
  { floor: 'FLOOR_1', x: 477, y: 828},
  { floor: 'FLOOR_1', x: 151, y: 576 },
  { floor: 'FLOOR_1', x: 284, y: 400 },
  { floor: 'FLOOR_1', x: 725, y: 128 },
  { floor: 'FLOOR_1', x: 338, y: 148 },
  { floor: 'FLOOR_1', x: 1490, y: 266 },
  { floor: 'FLOOR_1', x: 1798, y: 146 },
  { floor: 'FLOOR_1', x: 1486, y: 792 },
  { floor: 'FLOOR_1', x: 1832, y: 536 },

  { floor: 'FLOOR_2', x: 1544, y: 782 },
  { floor: 'FLOOR_2', x: 1836, y: 532 },
  { floor: 'FLOOR_2', x: 1650, y: 346 },
  { floor: 'FLOOR_2', x: 1774, y: 174 },
  { floor: 'FLOOR_2', x: 1364, y: 172 },
  { floor: 'FLOOR_2', x: 729, y: 170 },
  { floor: 'FLOOR_2', x: 329, y: 176 },
  { floor: 'FLOOR_2', x: 291, y: 420 },
  { floor: 'FLOOR_2', x: 185, y: 582 },
  { floor: 'FLOOR_2', x: 562, y: 640 },
  { floor: 'FLOOR_2', x: 693, y: 736 },
  { floor: 'FLOOR_2', x: 375, y: 784 },
  { floor: 'FLOOR_2', x: 591, y: 898 },
];

export const getResourcesByFloor = async (req, res) => {
  try {
    console.log(
      Object.keys(
        prisma.resource.fields ?? {}
      )
    );

    const resources = await prisma.resource.findMany();

    res.json(resources);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

export const registerResource = async (req, res) => {
  try {
    const { type, name, capacity, isAvailable, floor, xCoordinates, yCoordinates } = req.body;
    console.log("BODY:", req.body);
    const targetX = xCoordinates ? parseFloat(xCoordinates) : null;
    const targetY = yCoordinates ? parseFloat(yCoordinates) : null;

    const isValidLocation = VALID_SPACES.some(space => 
      space.floor === floor && 
      Math.abs(space.x - targetX) < 20 && 
      Math.abs(space.y - targetY) < 20
    );

    if (!isValidLocation) {
      return res.status(400).json({ error: "Invalid coordinates: Clicked location does not match hardcoded map." });
    }

    const resource = await prisma.resource.create({
      data: { 
        type, 
        name, 
        capacity: capacity ? parseInt(capacity) : 1, 
        isAvailable, 
        floor, 
        xCoordinates: targetX, 
        yCoordinates: targetY 
      }
    });

    res.status(201).json(resource);
   } catch (error) {
    console.error(error);

    res.status(400).json({
      error: error.message
    });
  }
};

export const getReservations = async (req, res) => {
  try {
    const { id } = req.params; 
    const resource = await prisma.resource.findUnique({
      where: { id: parseInt(id) },
      include: { reservations: true }
    });
    res.status(200).json(resource ? resource.reservations : []);
  } catch (error) {
    console.error("Error fetching resource reservations:", error);
    res.status(500).json({ error: "Failed to load reservations." });
  }
};

export const getAccesses = async (req, res) => {
  try {
    const { id } = req.params;
    const resource = await prisma.resource.findUnique({
      where: { id: parseInt(id) },
      include: { accesses: true }
    });
    res.status(200).json(resource ? resource.accesses : []);
  } catch (error) {
    console.error("Error fetching resource accesses:", error);
    res.status(500).json({ error: "Failed to load accesses." });
  }
};

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

export const updateResource = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, capacity, isAvailable, floor, xCoordinates, yCoordinates } = req.body;

    const updateData = {
      name,
      capacity: parseInt(capacity),
      isAvailable,
      floor,
      xCoordinates: parseFloat(xCoordinates),
      yCoordinates: parseFloat(yCoordinates)
    };

    if (req.file) {
      updateData.image = `/assets/${req.file.filename}`;
    }

    const updatedResource = await prisma.resource.update({
      where: { id: parseInt(id) },
      data: updateData
    });

    res.status(200).json(updatedResource);
  } catch (error) {
    console.error("Error updating resource:", error);
    res.status(400).json({ error: "Failed to update resource." });
  }
};

export const deleteResource = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.resource.delete({
      where: { id: parseInt(id) }
    });
    res.status(200).json({ message: "Resource deleted successfully." });
  } catch (error) {
    console.error("Error deleting resource:", error);
    res.status(400).json({ error: "Failed to delete resource." });
  }
};