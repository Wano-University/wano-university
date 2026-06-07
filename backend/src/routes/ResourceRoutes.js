import { Router } from 'express';
import path from 'path'; // FIX 3: was used in multer config but never imported
import multer from 'multer';
import {
  getResources, registerResource, getResourcesByFloor,
  resourceStatus, getResourcesByType, getAccesses,
  getAllReservations, getAllAccesses, updateResource, deleteResource
} from '../controllers/ResourceController.js';
import { verifyToken, requireRole } from '../middleware/AuthMiddleware.js';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'src/assets'); 
  },
  filename: function (req, file, cb) {
    const title = req.body.title || 'dish';
    const slugifiedTitle = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    const ext = path.extname(file.originalname);
    cb(null, `${slugifiedTitle}${ext}`);
  }
});

const upload = multer({ storage });

const router = Router();

router.get('/', getResources);
router.post('/', verifyToken, requireRole(['ADMIN']), upload.single('image'), registerResource);

router.get('/floor/:floor', getResourcesByFloor);
router.get('/type/:type', getResourcesByType);

router.get('/reservations/all', getAllReservations);
router.get('/accesses/all', getAllAccesses);

router.patch('/:id/status', verifyToken, requireRole(['ADMIN']), resourceStatus);
router.get('/:id/accesses', getAccesses);

router.put('/:id', verifyToken, requireRole(['ADMIN']), updateResource);
router.delete('/:id', verifyToken, requireRole(['ADMIN']), deleteResource);

export default router;