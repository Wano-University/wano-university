import { Router } from 'express';
import { registerSensor, sensorStatus, getSensorsByfloor, getAllSensors, getSensorsByType, getAlerts,  getReadings, getAllAlerts,  getAllReadings} from '../controllers/SensorController.js';
import { verifyToken, requireRole } from '../middleware/AuthMiddleware.js';

const router = Router();

router.get('/',verifyToken, requireRole(['ADMIN','STAFF']), getAllSensors);
router.post('/',verifyToken, requireRole(['ADMIN']), registerSensor);

router.get('/floor/:floor',verifyToken,requireRole(['ADMIN','STAFF']), getSensorsByfloor);
router.get('/type/:type',verifyToken, requireRole(['ADMIN','STAFF']), getSensorsByType);

router.get('/data/alerts',verifyToken,requireRole(['ADMIN','STAFF']), getAllAlerts);
router.get('/data/readings',verifyToken,requireRole(['ADMIN','STAFF']), getAllReadings);

router.patch('/:id', verifyToken,requireRole(['ADMIN']), sensorStatus);
router.get('/:id/alerts',verifyToken,requireRole(['ADMIN','STAFF']), getAlerts);
router.get('/:id/readings',verifyToken,requireRole(['ADMIN','STAFF']), getReadings);

export default router;