import { Router } from 'express';
import {
  registerSensor,
  sensorStatus,
  getSensorsByfloor,
  getAllSensors,
  getSensorsByType,
  getAlerts,
  getReadings,
  getAllAlerts,
  getAllReadings,
  getAllActiveSensors,
  getAllActiveSensorsByFloor,
  getAllActiveSensorsByType,
  resolveAlert,
  getPendingAlerts,
  updateSensor,
  deleteSensor
} from '../controllers/SensorController.js';
import { verifyToken, requireRole } from '../middleware/AuthMiddleware.js';


const router = Router();

// --- Standard Routes (Returns all sensors) ---
router.get('/', verifyToken, requireRole(['ADMIN', 'STAFF']), getAllSensors);
router.post('/', verifyToken, requireRole(['ADMIN']), registerSensor);
router.patch('/:id', verifyToken, requireRole(['ADMIN']), sensorStatus);

router.get('/floor/:floor', verifyToken, requireRole(['ADMIN', 'STAFF']), getSensorsByfloor);
router.get('/type/:type', verifyToken, requireRole(['ADMIN', 'STAFF']), getSensorsByType);

// --- Active Only Routes (Prefixed to avoid collisions) ---
router.get('/active/all', verifyToken, requireRole(['ADMIN', 'STAFF']), getAllActiveSensors);
router.get('/active/floor/:floor', verifyToken, requireRole(['ADMIN', 'STAFF']), getAllActiveSensorsByFloor);
router.get('/active/type/:type', verifyToken, requireRole(['ADMIN', 'STAFF']), getAllActiveSensorsByType);

// --- Data Aggregation ---
router.get('/data/alerts', verifyToken, requireRole(['ADMIN', 'STAFF']), getAllAlerts);
router.get('/data/readings', verifyToken, requireRole(['ADMIN', 'STAFF']), getAllReadings);

// --- Specific Sensor ---
router.get('/:id/alerts', verifyToken, requireRole(['ADMIN', 'STAFF']), getAlerts);
router.get('/:id/readings', verifyToken, requireRole(['ADMIN', 'STAFF']), getReadings);

router.get('/alerts/pending', verifyToken, requireRole(['ADMIN', 'STAFF']), getPendingAlerts);
router.patch('/alerts/:id/resolve', verifyToken, requireRole(['ADMIN', 'STAFF']), resolveAlert);

router.put('/:id', verifyToken, requireRole(['ADMIN', 'STAFF']), updateSensor);  
router.delete('/:id', verifyToken, requireRole(['ADMIN', 'STAFF']), deleteSensor);

export default router;
