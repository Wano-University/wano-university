import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { verifyToken, requireRole, checkPermission } from '../middleware/AuthMiddleware.js';
import { createDish, getAllDishes, setDish, getDishesByType, updateDish, deleteDish } from '../controllers/DishController.js';

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

const upload = multer({ storage: storage });

const router = Router();

router.get('/', getAllDishes);
router.get('/type/:type', getDishesByType);
router.post('/', verifyToken, requireRole(['ADMIN']), checkPermission('GERIR_EMENTA'), upload.single('image'), createDish);
router.patch('/:id', verifyToken, requireRole(['ADMIN']), checkPermission('GERIR_EMENTA'), setDish);
router.put('/:id', verifyToken, requireRole(['ADMIN']), checkPermission('GERIR_EMENTA'), upload.single('image'), updateDish);
router.delete('/:id', verifyToken, requireRole(['ADMIN']), checkPermission('GERIR_EMENTA'), deleteDish);

export default router;