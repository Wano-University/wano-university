import prisma from '../config/db.js';

export const getAllReservationsList = async (req, res) => {
  try {
    const reservations = await prisma.reservation.findMany({
      include: { user: true, resource: true, mobilityResource: true }
    });
    res.status(200).json(reservations);
  } catch (error) {
    console.error("Error fetching reservations:", error);
    res.status(500).json({ error: "Failed to load reservations." });
  }
};

export const createReservation = async (req, res) => {
  try {
    const loggedInUserId = req.user.userId;
    const { resourceId, mobilityResourceId, startTime, endTime, status } = req.body;

    const existingReservation = await prisma.reservation.findFirst({
        where: {
          startTime: new Date(startTime),
          endTime: new Date(endTime)
        }
      });

      if (existingReservation) {
        return res.status(400).json({
          message: "A reservation already exists for these time slots.",
          reservation: existingReservation
        });
      }

    const reservation = await prisma.reservation.create({
      data: {
        userId: loggedInUserId, 
        resourceId: resourceId ? parseInt(resourceId) : null,
        mobilityResourceId: mobilityResourceId ? parseInt(mobilityResourceId) : null,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        status
      }
    });

    res.status(201).json(reservation);
  } catch (error) {
    console.error("Error creating reservation:", error);
    res.status(400).json({ error: error.message || "Failed to create reservation." });
  }
};

export const updateReservationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; 

    const updatedReservation = await prisma.reservation.update({
      where: { id: parseInt(id) },
      data: { status }
    });
    res.status(200).json(updatedReservation);
  } catch (error) {
    res.status(400).json({ error: "Failed to update reservation status." });
  }
};

export const getReservationsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const reservations = await prisma.reservation.findMany({
      where: { userId: parseInt(userId) },
      include: { resource: true, mobilityResource: true }
    });
    res.status(200).json(reservations);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user reservations." });
  }
};