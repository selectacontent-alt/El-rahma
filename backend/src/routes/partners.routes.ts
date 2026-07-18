import { Router } from 'express';
import { getAll, create, update, remove } from '../controllers/partners.controller';
import { authenticate, adminOnly } from '../middleware/auth.middleware';
import { upload } from '../middleware/upload.middleware';

const router = Router();

router.get('/', getAll);
router.post('/', authenticate, adminOnly, upload.single('logoUrl'), create);
router.put('/:id', authenticate, adminOnly, upload.single('logoUrl'), update);
router.delete('/:id', authenticate, adminOnly, remove);

export default router;
