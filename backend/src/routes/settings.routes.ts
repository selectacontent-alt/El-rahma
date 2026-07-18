import { Router } from 'express';
import { getAll, getOne, update } from '../controllers/settings.controller';
import { authenticate, adminOnly } from '../middleware/auth.middleware';

const router = Router();

router.get('/', getAll);
router.get('/:key', getOne);
router.put('/:key', authenticate, adminOnly, update);

export default router;
