import prisma from '../config/db.js';

export const getActiveMenu = async (req, res) => {
  try {
    const menu = await prisma.menu.findFirst({
      include: { dishes: true }
    });

    if (!menu) {
      return res.status(404).json({ message: "No active dishes found." });
    }

    res.status(200).json(menu.dishes);
  } catch (error) {
    console.error("Error fetching menu:", error);
    res.status(500).json({ error: "Error loading the menu." });
  }
};

export const updateActiveMenu = async (req, res) => {
  try {
    const { dishIds } = req.body; 

    if (!dishIds || dishIds.length > 10) {
      return res.status(400).json({ error: "A menu can only feature up to 10 dishes." });
    }

    let menu = await prisma.menu.findFirst();

    if (!menu) {
      menu = await prisma.menu.create({ data: {} });
    }

    const connectedDishes = dishIds.map(id => ({ id: parseInt(id) }));

    const updatedMenu = await prisma.menu.update({
      where: { id: menu.id },
      data: {
        dishes: {
          set: connectedDishes 
        }
      },
      include: { dishes: true }
    });

    res.status(200).json({ 
      message: "Menu successfully updated for the week!", 
      dishes: updatedMenu.dishes 
    });
  } catch (error) {
    console.error("Error updating menu:", error);
    res.status(500).json({ error: "Failed to update the active dishes." });
  }
};