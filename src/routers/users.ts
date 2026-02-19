import { Router } from 'express';

import { validateBody } from '../middlewares/validateBody.js';
import { authenticate } from '../middlewares/authenticate.js';
import { authorize } from '../middlewares/authorize.js';
import { updateUserByAdminSchema } from '../validation/users.js';
import {
  getUserByIdController,
  listUsersController,
  updateUserByAdminController,
  listTechniciansController,
  getMeController,
} from '../controllers/users.js';

const router = Router();

router.use(authenticate);

router.get('/me', getMeController);

router.get(
  '/technicians',
  authorize('admin', 'manager'),
  listTechniciansController,
);

router.get('/', authorize('admin'), listUsersController);
router.get('/:id', authorize('admin'), getUserByIdController);
router.patch(
  '/:id',
  authorize('admin'),
  validateBody(updateUserByAdminSchema),
  updateUserByAdminController,
);

export default router;
