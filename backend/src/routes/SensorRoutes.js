import { Router } from 'express';
import { registerSensor, sensorStatus, getAllSensors, getSensorsByType, getAlerts, getReadings, getAllAlerts, getAllReadings} from '../controllers/SensorController.js';

const router = Router();

router.post('/registerSensor', registerSensor);
router.patch('/sensorStatus', sensorStatus);
router.get('/getAllSensors', getAllSensors);
router.get('/getSensorsByType', getSensorsByType);
router.get('/getAlerts', getAlerts);
router.get('/getReadings', getReadings);
router.get('/getAllAlerts', getAllAlerts);
router.get('/getAllReadings', getAllReadings);

export default router;