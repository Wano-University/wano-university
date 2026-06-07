import { Router } from 'express';
import { exportEnergyReport, runEnergySimulation, updateEnergySensorLimits } from '../controllers/EnergyController.js';
import { verifyToken, requireRole } from '../middleware/AuthMiddleware.js';

const router = Router();

router.get('/report', verifyToken, requireRole(['ADMIN', 'STAFF']), exportEnergyReport);
router.post('/simulate', verifyToken, requireRole(['ADMIN', 'STAFF']), runEnergySimulation);
router.patch('/:id/limits', verifyToken, requireRole(['ADMIN', 'STAFF']), updateEnergySensorLimits);

export default router;
