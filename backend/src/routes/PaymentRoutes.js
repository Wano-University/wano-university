import { Router } from 'express';
import { confirmPayment, createPaymentIntent } from '../controllers/PaymentController.js';
import { verifyToken, requireRole, checkPermission } from '../middleware/AuthMiddleware.js';

const router = Router();

router.post('/create-intent', verifyToken, checkPermission('FAZER_COMPRAS_CANTINA'), createPaymentIntent);
router.post('/confirm', verifyToken, checkPermission('FAZER_COMPRAS_CANTINA'), confirmPayment);

export default router;
