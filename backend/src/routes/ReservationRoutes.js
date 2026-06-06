import { Router } from 'express';

import { getAllReservationsList, createReservation, updateReservationStatus, getReservationsByUser, validateReservationQR } from '../controllers/ReservationController.js';
import { verifyToken, requireRole, checkPermission } from '../middleware/AuthMiddleware.js';

const router = Router();

router.get('/', verifyToken, getAllReservationsList);
router.post('/', verifyToken, checkPermission('RESERVAR_SALAS'), createReservation);
router.post('/validate', verifyToken, requireRole('STAFF'), validateReservationQR);

router.get('/user/:userId', verifyToken, getReservationsByUser);
router.patch('/:id', verifyToken, updateReservationStatus);

export default router;
