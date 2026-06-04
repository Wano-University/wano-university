import { Router } from 'express';
import { registerSensor, sensorStatus, getSensorsByfloor, getAllSensors, getSensorsByType, getAlerts,  getReadings, getAllAlerts,  getAllReadings} from '../controllers/SensorController.js';

const router = Router();

router.get('/', getAllSensors);
router.post('/', registerSensor);

router.get('/floor/:floor', getSensorsByfloor);
router.get('/type/:type', getSensorsByType);

router.get('/data/alerts', getAllAlerts);
router.get('/data/readings', getAllReadings);

router.patch('/:id', sensorStatus);
router.get('/:id/alerts', getAlerts);
router.get('/:id/readings', getReadings);

export default router;