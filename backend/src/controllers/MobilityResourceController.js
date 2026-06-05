import prisma from '../config/db.js';

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
    const { type, identifier, location, status } = req.body;

    const mobilityResource = await prisma.mobilityResource.create({
      data: { type, identifier, location, status }
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
      where: { type: type }
    });
    res.status(200).json(mobilityResources);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch mobility resources by type." });
  }
};