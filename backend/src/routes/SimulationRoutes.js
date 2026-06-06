import express from 'express';
import { getTemperatureSimulation, exportTemperatureReport, updateTempSensorLimits } from '../controllers/TemperatureController.js';
import { getAirQualitySimulation, exportAirQualityReport, updateAirQualitySensorLimits } from '../controllers/AirQualityController.js';
import { getEnergySimulation, exportEnergyReport, updateEnergySensorLimits} from '../controllers/EnergyController.js';

console.log("SimulationRoutes loaded");

const router = express.Router();

// --- Temperature ---
router.put('/temperature/:id', updateTempSensorLimits);
router.get('/temperature/export', exportTemperatureReport);
router.get('/temperature', getTemperatureSimulation);

// --- Air Quality ---
router.get('/air-quality/export', exportAirQualityReport);
router.put('/air-quality/:id', updateAirQualitySensorLimits);
router.get('/air-quality', getAirQualitySimulation);

// --- Energy Consumption ---
router.get('/energy/export', exportEnergyReport);
router.put('/energy/:id', updateEnergySensorLimits);
router.get('/energy', getEnergySimulation);

export default router;