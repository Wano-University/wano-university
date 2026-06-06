import { Router } from 'express';
// 🔴 MUDANÇA AQUI: Importa todas as funções exportadas como um objeto chamado adminController
import * as adminController from '../controllers/AdminController.js'; 
import { verifyToken, requireRole, checkPermission } from '../middleware/AuthMiddleware.js';

const router = Router();

// Agora o adminController.getAllUsers e o adminController.updateUserPermissions vão funcionar perfeitamente!
router.get('/', verifyToken, requireRole(['ADMIN']), checkPermission('GERIR_USERS'), adminController.getAllUsers);
router.put('/:id/permissions', verifyToken, requireRole(['ADMIN']), checkPermission('GERIR_USERS'), adminController.updateUserPermissions);

export default router;