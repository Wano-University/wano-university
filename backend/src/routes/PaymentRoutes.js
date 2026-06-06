import { Router } from 'express';
import { confirmPayment, createPaymentIntent } from '../controllers/PaymentController.js';
import { verifyToken, requireRole } from '../middleware/AuthMiddleware.js';

const router = Router();

router.post('/create-intent', verifyToken, createPaymentIntent);
router.post('/confirm', verifyToken, confirmPayment);

export default router;
