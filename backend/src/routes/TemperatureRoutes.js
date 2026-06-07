import { Router } from 'express';
import { exportTemperatureReport, runTemperatureSimulation, updateTempSensorLimits, getTemperatureTrend } from '../controllers/TemperatureController.js';
import { verifyToken, requireRole } from '../middleware/AuthMiddleware.js';

const router = Router();

router.get('/report', verifyToken, requireRole(['ADMIN', 'STAFF']), exportTemperatureReport);
router.post('/simulate', verifyToken, requireRole(['ADMIN', 'STAFF']), runTemperatureSimulation);
router.patch('/:id/limits', verifyToken, requireRole(['ADMIN', 'STAFF']), updateTempSensorLimits);
router.get('/trend', verifyToken, requireRole(['ADMIN', 'STAFF']), getTemperatureTrend);

export default router;
