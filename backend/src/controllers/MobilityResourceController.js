import prisma from '../config/db.js';

const VALID_SPACES = [
  { x: 410,  y: 835 }, { x: 480,  y: 835 }, { x: 550,  y: 835 }, { x: 620,  y: 835 }, { x: 690,  y: 835 }, { x: 760, y: 835 },
  { x: 1270, y: 835 }, { x: 1340, y: 835 }, { x: 1410, y: 835 }, { x: 1480,  y: 835 }, { x: 1550,  y: 835 }, { x: 1620, y: 835 },
  { x: 1753, y: 810 }, { x: 1753, y: 760 }, { x: 1753, y: 710 }, { x: 1753,  y: 660 }, { x: 1753,  y: 610 },
  { x: 1753, y: 460 }, { x: 1753, y: 410 }, { x: 1753, y: 360 }, { x: 1753,  y: 310 }, { x: 1753,  y: 260 }, { x: 1753, y: 210 },
  { x: 1540, y: 710 }, { x: 1540, y: 660 }, { x: 1540, y: 610  }, { x: 1540,  y: 560  }, { x: 1540,  y: 510 }, { x: 1540, y: 460 }, { x: 1540, y: 410 }, { x: 1540,  y: 360 }, { x: 1540,  y: 310 }, { x: 1540, y: 260 },
  { x: 1415, y: 710 }, { x: 1415, y: 660 }, { x: 1415, y: 610 }, { x: 1415,  y: 560 }, { x: 1415,  y: 510 }, { x: 1415, y: 460 }, { x: 1415, y: 410 }, { x: 1415,  y: 360 }, { x: 1415,  y: 310 }, { x: 1415, y: 260 },
  { x: 1190, y: 760 }, { x: 1190, y: 710 }, { x: 1190, y: 660 }, { x: 1190, y: 610 }, { x: 1190,  y: 560 }, { x: 1190,  y: 510 }, { x: 1190, y: 460 }, { x: 1190, y: 410 }, { x: 1190,  y: 360 }, { x: 1190,  y: 310 }, { x: 1190, y: 260 },
  { x: 840, y: 760 }, { x: 840, y: 710 }, { x: 840, y: 660 }, { x: 840, y: 610 }, { x: 840,  y: 560 }, { x: 840,  y: 510 }, { x: 840, y: 460 }, { x: 840, y: 410 }, { x: 840,  y: 360 }, { x: 840,  y: 310 }, { x: 840, y: 260 },
  { x: 615, y: 710}, { x: 615, y: 660 }, { x: 615, y: 610 }, { x: 615,  y: 560 }, { x: 615,  y: 510 }, { x: 615, y: 460 }, { x: 615, y: 410 }, { x: 615,  y: 360 }, { x: 615,  y: 310 }, { x: 615, y: 260 },
  { x: 490, y: 710 }, { x: 490, y: 660 }, { x: 490, y: 610 }, { x: 490,  y: 560 }, { x: 490,  y: 510 }, { x: 490, y: 460 }, { x: 490, y: 410}, { x: 490,  y: 360 }, { x: 490,  y: 310 }, { x: 490, y: 260 },
  { x: 277, y: 810 }, { x: 277, y: 760 }, { x:  277, y: 710}, { x: 277,  y: 660 }, { x: 277,  y: 610 },
  { x: 277, y: 460 }, { x: 277, y: 410}, { x: 277, y: 360 }, { x: 277,  y: 310}, { x: 277,  y: 260 }, { x: 277, y: 210 },
];

export const getMobilityResources = async (req, res) => {
  try {
    const mobilityResources = await prisma.mobilityResource.findMany({
      include: { sensor: true, reservations: true }
    });
    res.status(200).json(mobilityResources);
  } catch (error) {
    console.error("Error fetching mobility resources:", error);
    res.status(500).json({ error: "Error loading mobility resources." });
  }
};

export const registerMobilityResource = async (req, res) => {
  try {
    const { type, identifier, location, status, xCoordinates, yCoordinates } = req.body;
    const targetX = xCoordinates ? parseFloat(xCoordinates) : null;
    const targetY = yCoordinates ? parseFloat(yCoordinates) : null;

    if (type === 'PARKING_SPOT') {
      const isValidLocation = VALID_SPACES.some(space =>
        Math.abs(space.x - targetX) < 20 &&
        Math.abs(space.y - targetY) < 20
      );

      if (!isValidLocation) {
        return res.status(400).json({ error: "Invalid coordinates: location does not match a known space." });
      }
    }

    const mobilityResource = await prisma.mobilityResource.create({
      data: { type, identifier, location, status, xCoordinates: targetX, yCoordinates: targetY }
    });

    res.status(201).json(mobilityResource);
  } catch (error) {
    console.error("Error registering mobility resource:", error);
    res.status(400).json({ error: "Failed to register mobility resource." });
  }
};

export const mobilityResourceStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updatedMobility = await prisma.mobilityResource.update({
      where: { id: parseInt(id) },
      data: { status }
    });
    res.status(200).json(updatedMobility);
  } catch (error) {
    res.status(400).json({ error: "Failed to update mobility status." });
  }
};

export const getMobilityResourcesByType = async (req, res) => {
  try {
    const { type } = req.params;
    const mobilityResources = await prisma.mobilityResource.findMany({
      where: { type }
    });
    res.status(200).json(mobilityResources);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch mobility resources by type." });
  }
};

export const updateMobilityStatus = async (req, res) => {
  try {
    const { id } = req.params; 
    const { status } = req.body;
    const { identifier } = req.body;

    if (!status) {
      return res.status(400).json({ error: "A status must be provided to update." });
    }
    const updatedResource = await prisma.mobilityResource.update({
      where: { 
        id: parseInt(id) 
      },
      data: { 
        status: status, 
        identifier: req.body.identifier
      }
    });

    res.status(200).json(updatedResource);
  } catch (error) {
    console.error("Error updating mobility resource status:", error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: "Mobility resource not found." });
    }
    
    res.status(400).json({ error: "Failed to update mobility resource." });
  }
};

export const deleteMobilityResource = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.mobilityResource.delete({
      where: { id: parseInt(id) }
    });
    res.status(200).json({ message: "Mobility resource deleted successfully." });
  } catch (error) {
    console.error("Error deleting resource:", error);
    res.status(400).json({ error: "Failed to delete resource." });
  }
};