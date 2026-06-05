import { Router } from 'express';
import { getMobilityResources, registerMobilityResource, mobilityResourceStatus, getMobilityResourcesByType} from '../controllers/MobilityResourceController.js';
import { verifyToken, requireRole } from '../middleware/AuthMiddleware.js';

const router = Router();

router.get('/', getMobilityResources);
router.post('/', verifyToken, requireRole(['ADMIN']), registerMobilityResource);
router.get('/type/:type', getMobilityResourcesByType);
router.patch('/:id', verifyToken, requireRole(['ADMIN']),mobilityResourceStatus);

export default router;