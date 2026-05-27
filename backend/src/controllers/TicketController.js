import prisma from '../config/db.js';

export const getTicketsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const tickets = await prisma.ticket.findMany({
      where: { purchase: { userId: parseInt(userId) } },
      include: { dish: true, purchase: true }
    });
    res.status(200).json(tickets);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user tickets." });
  }
};

export const updateTicketStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; 

    const updatedTicket = await prisma.ticket.update({
      where: { id: parseInt(id) },
      data: { status }
    });
    res.status(200).json(updatedTicket);
  } catch (error) {
    res.status(400).json({ error: "Failed to update status." });
  }
};