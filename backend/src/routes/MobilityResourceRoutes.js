import { Router } from 'express';
import { getMobilityResources, registerMobilityResource, mobilityResourceStatus, getMobilityResourcesByType} from '../controllers/mobilityController.js';

const router = Router();

router.get('/', getMobilityResources);
router.post('/', registerMobilityResource);

router.get('/type/:type', getMobilityResourcesByType);

router.patch('/:id', mobilityResourceStatus);

export default router;