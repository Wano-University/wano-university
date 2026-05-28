import { Router } from 'express';
import { getTicketsByUser, updateTicketStatus } from '../controllers/TicketController.js';

const router = Router();

router.get('/user/:userId', getTicketsByUser);
router.patch('/:id/status', updateTicketStatus);

export default router;