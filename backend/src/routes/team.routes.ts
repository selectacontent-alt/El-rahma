import { Router } from 'express';
import { authenticate, adminOnly } from '../middleware/auth.middleware';
import * as teamController from '../controllers/team.controller';

const router = Router();

// Public endpoint (can be accessed by frontend without auth)
router.get('/', teamController.getTeam);
router.get('/:id', teamController.getTeamMember);

// Protected endpoints (require admin auth)
router.post('/', authenticate, adminOnly, teamController.createTeamMember);
router.put('/:id', authenticate, adminOnly, teamController.updateTeamMember);
router.delete('/:id', authenticate, adminOnly, teamController.deleteTeamMember);

export default router;
