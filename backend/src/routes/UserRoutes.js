import { Router } from 'express';
import { registerUser } from '../controllers/UserController.js';

const router = Router();

router.post('/create', registerUser);
router.post('/login', login);

export default router;
