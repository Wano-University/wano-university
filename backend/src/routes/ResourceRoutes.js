import { Router } from 'express';
import { getResources, registerResource, getResourcesByFloor, resourceStatus, getResourcesByType, getReservations, getAccesses, getAllReservations, getAllAccesses } from '../controllers/ResourceController.js';
import { verifyToken, requireRole, checkPermission } from '../middleware/AuthMiddleware.js';

const router = Router();

router.get('/', getResources);
router.post('/', verifyToken, requireRole(['ADMIN']), checkPermission('GERIR_SALAS_LABORATORIOS'), registerResource);

router.get('/floor/:floor', getResourcesByFloor);
router.get('/type/:type', getResourcesByType);

router.get('/reservations/all', getAllReservations);
router.get('/accesses/all', getAllAccesses);

router.patch('/:id/status', verifyToken, requireRole(['ADMIN']), checkPermission('GERIR_SALAS_LABORATORIOS'), resourceStatus);
router.get('/:id/reservations', getReservations);
router.get('/:id/accesses', getAccesses);


export default router;