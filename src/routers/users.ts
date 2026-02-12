import { Router } from 'express';

import { validateBody } from '../middlewares/validateBody.js';
import { authenticate } from '../middlewares/authenticate.js';
import { authorize } from '../middlewares/authorize.js';
import { updateUserByAdminSchema } from '../validation/users.js';
import {
  getUserByIdController,
  listUsersController,
  updateUserByAdminController,
} from '../controllers/users.js';

const router = Router();

router.use(authenticate);
router.use(authorize('admin'));

router.get('/', listUsersController);
router.get('/:id', getUserByIdController);
router.patch(
  '/:id',
  validateBody(updateUserByAdminSchema),
  updateUserByAdminController,
);

export default router;
