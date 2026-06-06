import { Router } from 'express';
import { getAllReservationsList, createReservation, updateReservationStatus, getReservationsByUser } from '../controllers/ReservationController.js';
import { verifyToken, requireRole, checkPermission } from '../middleware/AuthMiddleware.js';

const router = Router();

// Add verifyToken to the routes that need protection!
router.get('/', verifyToken, requireRole(['ADMIN', 'STAFF']), checkPermission('GERIR_SALAS_LABORATORIOS'), getAllReservationsList);
router.post('/', verifyToken, checkPermission('RESERVAR_SALAS'), createReservation); // <-- This fixes your error!

router.get('/user/:userId', verifyToken, getReservationsByUser);
router.patch('/:id', verifyToken, updateReservationStatus);

export default router;