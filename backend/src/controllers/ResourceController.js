import prisma from '../config/db.js';

const VALID_SPACES = [
  { floor: 'FLOOR_1', x: 477, y: 828 },
  { floor: 'FLOOR_1', x: 151, y: 576 },
  { floor: 'FLOOR_1', x: 800, y: 400 },
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

// 1. GET RESOURCES BY FLOOR (Patched)
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

// 2. REGISTER RESOURCE (Patched)
export const registerResource = async (req, res) => {
  try {
    const { type, name, capacity, isAvailable, floor, xCoordinates, yCoordinates } = req.body;
    console.log("BODY:", req.body);
    const targetX = xCoordinates ? parseFloat(xCoordinates) : null;
    const targetY = yCoordinates ? parseFloat(yCoordinates) : null;

    const floorNumber = (f) => parseInt(String(f).replace(/\D/g, ''));

    const isValidLocation = VALID_SPACES.some(space =>
      floorNumber(space.floor) === floorNumber(floor) &&
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



// 3. GET RESERVATIONS BY RESOURCE ID
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

// 4. GET ACCESSES BY RESOURCE ID
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

// 5. GET ALL RESOURCES
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

// 6. UPDATE RESOURCE STATUS
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

// 7. GET RESOURCES BY TYPE
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

// 8. GET ALL RESERVATIONS DATA
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

// 9. GET ALL ACCESSES DATA
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
