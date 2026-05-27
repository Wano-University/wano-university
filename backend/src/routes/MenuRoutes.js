import { Router } from 'express';
import { getActiveMenu, updateActiveMenu } from '../controllers/MenuController.js';

const router = Router();

router.get('/getMenu', getActiveMenu);  
router.put('/updateMenu', updateActiveMenu); 

export default router;