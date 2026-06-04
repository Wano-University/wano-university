import { Router } from 'express';
import { getResources, registerResource, getResourcesByfloor, resourceStatus, getResourcesByType, getReservations, getAccesses, getAllReservations, getAllAccesses } from '../controllers/resourceController.js';

const router = Router();

router.get('/', getResources);
router.post('/', registerResource);

router.get('/floor/:floor', getResourcesByfloor);
router.get('/type/:type', getResourcesByType);

router.get('/data/reservations', getAllReservations);
router.get('/data/accesses', getAllAccesses);

router.patch('/:id', resourceStatus);
router.get('/:id/reservations', getReservations);
router.get('/:id/accesses', getAccesses);

export default router;