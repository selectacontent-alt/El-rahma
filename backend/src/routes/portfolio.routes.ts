import { Router } from 'express';
import { getAll, getOne, create, update, remove } from '../controllers/portfolio.controller';
import { authenticate, adminOnly } from '../middleware/auth.middleware';
import { upload } from '../middleware/upload.middleware';

const router = Router();

router.get('/', getAll);
router.get('/:id', getOne);
router.post('/', authenticate, adminOnly, upload.single('image'), create);
router.put('/:id', authenticate, adminOnly, upload.single('image'), update);
router.delete('/:id', authenticate, adminOnly, remove);

export default router;
