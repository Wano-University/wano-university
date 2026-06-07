import { Router } from 'express';
import { getMobilityResources, registerMobilityResource,  mobilityResourceStatus,getMobilityResourcesByType,updateMobilityStatus, deleteMobilityResource, simulateParkingOccupancy} from '../controllers/MobilityResourceController.js';
import { verifyToken, requireRole } from '../middleware/AuthMiddleware.js';

const router = Router();

router.get('/', getMobilityResources);
router.post('/simulate', simulateParkingOccupancy); 
router.get('/type/:type', getMobilityResourcesByType);
router.post('/', verifyToken, requireRole(['ADMIN']), registerMobilityResource);
router.patch('/:id', verifyToken, requireRole(['ADMIN']), updateMobilityStatus);
router.delete('/:id', verifyToken, requireRole(['ADMIN']), deleteMobilityResource);

export default router;