import { Router } from 'express';
import { registerSensor, sensorStatus, getSensorsByfloor, getAllSensors, getSensorsByType, getAlerts, getReadings, getAllAlerts, getAllReadings} from '../controllers/SensorController.js';

const router = Router();

router.post('/registerSensor', registerSensor);
router.patch('/sensorStatus/:id', sensorStatus);
router.get('/getSensorsByfloor/:floor', getSensorsByfloor);
router.get('/getAllSensors', getAllSensors);
router.get('/getSensorsByType/:type', getSensorsByType);
router.get('/getAlerts', getAlerts);
router.get('/getReadings', getReadings);
router.get('/getAllAlerts', getAllAlerts);
router.get('/getAllReadings', getAllReadings);

export default router;