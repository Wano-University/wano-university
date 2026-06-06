import { Router } from 'express';
import { getActiveMenu, updateActiveMenu } from '../controllers/MenuController.js';
import { verifyToken, requireRole, checkPermission } from '../middleware/AuthMiddleware.js';

const router = Router();

router.get('/getMenu', getActiveMenu);
router.put('/updateMenu', verifyToken, requireRole(['ADMIN']), checkPermission('GERIR_EMENTA'), updateActiveMenu);

export default router;
