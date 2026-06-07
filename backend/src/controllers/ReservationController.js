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

    if (mobilityResourceId) {
      const activeVehicles = await prisma.reservation.count({
        where: {
          userId: loggedInUserId,
          mobilityResourceId: { not: null },
          status: 'ACTIVE',
          endTime: { gt: new Date() }
        }
      });

      if (activeVehicles >= 1) {
        return res.status(403).json({ message: "Users can only reserve 1 vehicle at a time." });
      }
    }

    if (resourceId) {
      const targetResource = await prisma.resource.findUnique({
        where: { id: parseInt(resourceId) }
      });

      if (!targetResource) {
        return res.status(404).json({ message: "Resource not found." });
      }

      if (targetResource.type === 'ROOM') {
        const user = await prisma.user.findUnique({
          where: { id: loggedInUserId },
          select: { type: true }
        });

        if (user?.type === 'STUDENT') {
          const activeRooms = await prisma.reservation.count({
            where: {
              userId: loggedInUserId,
              status: 'ACTIVE',
              endTime: { gt: new Date() },
              resource: { type: 'ROOM' }
            }
          });

          if (activeRooms >= 2) {
            return res.status(403).json({ message: "Students can only reserve up to 2 rooms at a time." });
          }
        }
      }
    }

    const existingReservation = await prisma.reservation.findFirst({
      where: {
        OR: [
          { resourceId: resourceId ? parseInt(resourceId) : undefined },
          { mobilityResourceId: mobilityResourceId ? parseInt(mobilityResourceId) : undefined }
        ],
        status: 'ACTIVE',
        startTime: { lt: new Date(endTime) },
        endTime: { gt: new Date(startTime) }
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
        status: status || 'ACTIVE'
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


export const validateReservationQR = async (req, res) => {
  try {
    const { qrToken } = req.body;

    const parsedId = parseInt(qrToken);

    const reservation = await prisma.reservation.findUnique({
      where: { id: parsedId },
      include: {
        resource: true,
        mobilityResource: true,
        accesses: true
      }
    });

    if (!reservation) return res.status(404).json({ error: "Reservation not found." });
    if (reservation.status !== 'ACTIVE') return res.status(403).json({ error: `Reservation is ${reservation.status.toLowerCase}` });

    const now = new Date();
    const isEquipment = reservation.resource?.type === 'EQUIPMENT';

    // Rooms, Labs, Vehicles
    if (!isEquipment) {
      const allowedStart = new Date(reservation.startTime.getTime() - 5 * 60000);

      if (now < allowedStart || now > reservation.endTime) {
        return res.status(403).json({ error: "Outside of allowed reservation window." });
      }

      await prisma.access.create({
        data: {
          userId: reservation.userId,
          resourceId: reservation.resourceId || reservation.mobilityResourceId,
          reservationId: reservation.id,
          accessType: 'ENTRY'
        }
      });

      return res.status(200).json({ action: 'UNLOCK_SUCCESS', message: "Access granted." });
    }

    // Equipment Check-in/Check-out
    if (isEquipment) {
      const hasCheckedOut = reservation.accesses.some(a => a.accessType === 'ENTRY');
      const hasReturned = reservation.accesses.some(a => a.accessType === 'EXIT');

      if (!hasCheckedOut) {
        await prisma.access.create({
          data: {
            userId: reservation.userId,
            resourceId: reservation.resourceId,
            reservationId: reservation.id,
            accessType: 'ENTRY'
          }
        });
        return res.status(200).json({ action: 'CHECKOUT_SUCCESS', message: "Equipment checked out." });
      }

      if (hasCheckedOut && !hasReturned) {
        await prisma.$transaction([
          prisma.access.create({
            data: {
              userId: reservation.userId,
              resourceId: reservation.resourceId,
              reservationId: reservation.id,
              accessType: 'EXIT'
            }
          }),
          prisma.reservation.update({
            where: { id: reservation.id },
            data: { status: 'COMPLETED' }
          })
        ]);
        return res.status(200).json({ action: 'RETURN_SUCCESS', message: "Equipment returned." });
      }

      return res.status(400).json({ error: "Equipment already returned." });
    }

  } catch (error) {
    console.error("QR Validation Error:", error);
    res.status(500).json({ error: "Invalid QR code or server error." });
  }
};

export const getAccessLogs = async (req, res) => {
  try {
    const logs = await prisma.accessLog.findMany({
      orderBy: { accessDate: 'desc' },
      take: 50,
      include: { user: true, resource: true }
    });
    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch logs" });
  }
};
