import { Router } from 'express';
import { registerUser, login, resetPassword, changePassword } from '../controllers/UserController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/register', registerUser);
router.post('/login', login);
router.post('/resetpw', resetPassword);
router.post('/changepw', verifyToken, changePassword);

export default router;
