import { Router } from 'express';
import { getAll, getOne, create, updateStatus, remove } from '../controllers/contacts.controller';
import { authenticate, adminOnly } from '../middleware/auth.middleware';

const router = Router();

router.get('/', authenticate, adminOnly, getAll);
router.get('/:id', authenticate, adminOnly, getOne);
router.post('/', create);
router.patch('/:id/status', authenticate, adminOnly, updateStatus);
router.delete('/:id', authenticate, adminOnly, remove);

export default router;
