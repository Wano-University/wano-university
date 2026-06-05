import { Router } from 'express';
import { getAllReservationsList, createReservation, updateReservationStatus, getReservationsByUser } from '../controllers/ReservationController.js';
import { verifyToken, requireRole } from '../middleware/AuthMiddleware.js';

const router = Router();

// Add verifyToken to the routes that need protection!
router.get('/', verifyToken, getAllReservationsList); 
router.post('/', verifyToken, createReservation); // <-- This fixes your error!

router.get('/user/:userId', verifyToken, getReservationsByUser);
router.patch('/:id', verifyToken, updateReservationStatus);

export default router;