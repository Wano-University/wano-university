import { Router } from 'express';
import { getAllUsers,updateUserPermissions,updateProfile} from '../controllers/AdminController.js'; 
import { verifyToken, requireRole, checkPermission } from '../middleware/AuthMiddleware.js';

const router = Router();

router.get('/', verifyToken, requireRole(['ADMIN']),getAllUsers);
router.put('/:id/permissions', verifyToken, requireRole(['ADMIN']),updateUserPermissions);
router.put('/:id/profile', verifyToken, requireRole(['ADMIN']), updateProfile);

// Para isto (apenas para teste):
router.put('/test', (req, res) => res.send("Rota encontrada!"));

export default router;