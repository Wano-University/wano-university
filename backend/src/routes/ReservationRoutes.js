import { Router } from 'express';
import { getAllReservationsList, createReservation, updateReservationStatus, getReservationsByUser } from '../controllers/reservationController.js';

const router = Router();

router.get('/', getAllReservationsList);
router.post('/', createReservation);

router.get('/user/:userId', getReservationsByUser);

router.patch('/:id', updateReservationStatus);

export default router;