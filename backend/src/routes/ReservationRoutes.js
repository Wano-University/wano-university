import { Router } from 'express';
import { getAllReservationsList, createReservation, updateReservationStatus, getReservationsByUser } from '../controllers/ReservationController.js';
import { verifyToken, requireRole } from '../middleware/AuthMiddleware.js';

const router = Router();

router.get('/', verifyToken, getAllReservationsList); 
router.post('/', verifyToken, createReservation); 

router.get('/user/:userId', verifyToken, getReservationsByUser);
router.patch('/:id', verifyToken, updateReservationStatus);

export default router;