import { Router } from 'express';
import { createPaymentIntent } from '../controllers/PaymentController.js';
import { verifyToken, requireRole } from '../middleware/AuthMiddleware.js';

const router = Router();

router.post('/create-intent', verifyToken, createPaymentIntent);

export default router;
