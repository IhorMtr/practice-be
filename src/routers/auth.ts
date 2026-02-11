import { Router } from 'express';

import { registerUserSchema, loginUserSchema } from '../validation/auth.js';
import { validateBody } from '../middlewares/validateBody.js';
import {
  loginUserController,
  logoutUserController,
  refreshUsersSessionController,
  registerUserController,
} from '../controllers/auth.js';
import { requireRefreshSession } from '../middlewares/requireRefreshSession.js';

const router = Router();

router.post(
  '/register',
  validateBody(registerUserSchema),
  registerUserController,
);
router.post('/login', validateBody(loginUserSchema), loginUserController);

router.post('/logout', requireRefreshSession, logoutUserController);
router.post('/refresh', refreshUsersSessionController);

export default router;
