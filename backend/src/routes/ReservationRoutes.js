import { Router } from 'express';
import { getAllReservationsList, createReservation, updateReservationStatus, getReservationsByUser, validateReservationQR, getAccessLogs } from '../controllers/ReservationController.js';
import { verifyToken, requireRole } from '../middleware/AuthMiddleware.js';


import { getAllReservationsList, createReservation, updateReservationStatus, getReservationsByUser, validateReservationQR } from '../controllers/ReservationController.js';
import { verifyToken, requireRole, checkPermission } from '../middleware/AuthMiddleware.js';


const router = Router();

router.get('/', verifyToken, getAllReservationsList);
router.post('/', verifyToken, createReservation);
router.post('/validate', verifyToken, requireRole('STAFF'), validateReservationQR);

router.get('/user/:userId', verifyToken, getReservationsByUser);
router.patch('/:id', verifyToken, updateReservationStatus);

router.post('/accesslogs', verifyToken, requireRole('STAFF', 'ADMIN'), getAccessLogs);

export default router;
