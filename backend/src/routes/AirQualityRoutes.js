import { Router } from 'express';
import { exportAirQualityReport, runAirQualitySimulation, updateAirQualitySensorLimits } from '../controllers/AirQualityController.js';
import { verifyToken, requireRole } from '../middleware/AuthMiddleware.js';

const router = Router();

router.get('/report', verifyToken, requireRole(['ADMIN', 'STAFF']), exportAirQualityReport);
router.post('/simulate', verifyToken, requireRole(['ADMIN', 'STAFF']), runAirQualitySimulation);
router.patch('/:id/limits', verifyToken, requireRole(['ADMIN', 'STAFF']), updateAirQualitySensorLimits);

export default router;
