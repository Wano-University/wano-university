import prisma from '../config/db.js';


export const createDish = async (req, res) => {
  try {
    const { title, subtitle, desc, image, color } = req.body;

    const dish = await prisma.dish.create({
      data: { title, subtitle, desc, image, color }
    });

    res.status(201).json(dish);
  } catch (error) {
    console.error("Error creating dish:", error);
    res.status(400).json({ error: "Failed to create dish." });
  }
};

export const setDish = async (req, res) => {
  try{
    const {id} = req.params;
    const {isActive} = req.params;

    const updatedDish = await prisma.dish.update({
      where: { id: parseInt(id) },
      data: { isActive }
    });
    res.status(200).json(updatedDish);
  } catch (error) {
    res.status(400).json({ error: "Failed to set as active." });
  }
};

export const getAllDishes = async (req, res) => {
  try {
    const dishes = await prisma.dish.findMany();
    res.status(200).json(dishes);
  } catch (error) {
    res.status(500).json({ error: "Failed to load catalog." });
  }
};