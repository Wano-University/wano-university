import { Router } from 'express';
import { getTicketsByUser, updateTicketStatus } from '../controllers/TicketController.js';

const router = Router();

router.post('/user', getTicketsByUser);
router.patch('/status', updateTicketStatus);

export default router;
