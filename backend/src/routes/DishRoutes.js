import { Router } from 'express';
import { createDish, getAllDishes } from '../controllers/DishController.js';

const router = Router();

router.post('/createDish', createDish);
router.get('/getDishes', getAllDishes);

export default router;