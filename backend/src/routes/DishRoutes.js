import { Router } from 'express';
import { createDish, getAllDishes, setDish } from '../controllers/DishController.js';

const router = Router();

router.post('/createDish', createDish);
router.get('/getDishes', getAllDishes);
router.patch('/setDish', setDish)

export default router;