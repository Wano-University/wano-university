import prisma from '../config/db.js';

export const createDish = async (req, res) => {
  try {
    const { title, subtitle, desc, color, dishType, isActive } = req.body;
    
    const imagePath = req.file ? `/assets/${req.file.filename}` : '';

    const dish = await prisma.dish.create({
      data: { 
        title, 
        subtitle, 
        desc, 
        image: imagePath, 
        color, 
        dishType,
        isActive: isActive === 'true'
      }
    });

    res.status(201).json(dish);
  } catch (error) {
    console.error("Error creating dish:", error);
    res.status(400).json({ error: "Failed to create dish." });
  }
};

export const setDish = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body; 

    const updatedDish = await prisma.dish.update({
      where: { id: parseInt(id) },
      data: { isActive }
    });
    
    res.status(200).json(updatedDish);
  } catch (error) {
    console.error("Error setting dish active status:", error);
    res.status(400).json({ error: "Failed to set as active." });
  }
};

export const getAllDishes = async (req, res) => {
  try {
    console.log("getAllDishes reached");
    const dishes = await prisma.dish.findMany();
    res.status(200).json(dishes);
  } catch (error) {
    console.error("Error loading dishes:", error);
    res.status(500).json({ error: "Failed to load catalog." });
  }
};

export const getDishesByType = async (req, res) => {
  try {
    const { type } = req.params;

    const dishes = await prisma.dish.findMany({
      where: {dishType: type }});


    res.status(200).json(dishes);
  } catch (error) {
    console.error("Error loading dishes:", error);
    res.status(500).json({ error: "Failed to load catalog." });
  }
};

export const updateDish = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, subtitle, desc, color, dishType, isActive } = req.body;
    
    const updateData = {
      title, 
      subtitle, 
      desc, 
      color, 
      dishType,
      isActive: isActive === 'true'
    };

    if (req.file) {
      updateData.image = `/assets/${req.file.filename}`;
    }

    const updatedDish = await prisma.dish.update({
      where: { id: parseInt(id) },
      data: updateData
    });

    res.status(200).json(updatedDish);
  } catch (error) {
    console.error("Error updating dish:", error);
    res.status(400).json({ error: "Failed to update dish." });
  }
};

export const deleteDish = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.dish.delete({
      where: { id: parseInt(id) }
    });
    res.status(200).json({ message: "Dish deleted successfully." });
  } catch (error) {
    console.error("Error deleting dish:", error);
    res.status(400).json({ error: "Failed to delete dish." });
  }
};