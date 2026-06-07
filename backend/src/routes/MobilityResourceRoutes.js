import { Router } from 'express';
import { getMobilityResources, registerMobilityResource,  mobilityResourceStatus,getMobilityResourcesByType,updateMobilityStatus, deleteMobilityResource} from '../controllers/MobilityResourceController.js';
import { verifyToken, requireRole } from '../middleware/AuthMiddleware.js';

const router = Router();

router.get('/', getMobilityResources);
router.post('/', verifyToken, requireRole(['ADMIN']),registerMobilityResource);
router.get('/type/:type', getMobilityResourcesByType);
router.patch('/:id', verifyToken, requireRole(['ADMIN']), mobilityResourceStatus);
router.delete('/:id', verifyToken, requireRole(['ADMIN']), deleteMobilityResource);
router.patch('/:id', verifyToken, requireRole(['ADMIN']), updateMobilityStatus);

export default router;