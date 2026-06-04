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
  getAllReadings
} from '../controllers/SensorController.js';

const router = Router();

// 1. Root Routes (Matches: /api/sensors)
router.get('/', getAllSensors);
router.post('/', registerSensor);

// 2. Specific Sub-routes (Matches: /api/sensors/floor/FLOOR_1, etc.)
router.get('/floor/:floor', getSensorsByfloor);
router.get('/type/:type', getSensorsByType);

// 3. Data Sub-routes (Matches: /api/sensors/data/alerts, etc.)
router.get('/data/alerts', getAllAlerts);
router.get('/data/readings', getAllReadings);

// 4. Dynamic ID Routes (Matches: /api/sensors/5, /api/sensors/5/alerts)
// Note: These must stay at the bottom so Express doesn't mistake "data" or "floor" for an ID!
router.patch('/:id', sensorStatus);
router.get('/:id/alerts', getAlerts);
router.get('/:id/readings', getReadings);

export default router;