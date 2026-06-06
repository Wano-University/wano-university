import { Router } from 'express';
import { getAllUsers,updateUserPermissions} from '../controllers/AdminController.js'; 
import { verifyToken, requireRole, checkPermission } from '../middleware/AuthMiddleware.js';

const router = Router();

router.get('/', verifyToken, requireRole(['ADMIN']),getAllUsers);
router.put('/:id/permissions', verifyToken, requireRole(['ADMIN']),updateUserPermissions);

export default router;