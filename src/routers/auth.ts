import { Router } from 'express';

import {
  registerUserSchema,
  loginUserSchema,
  refreshSchema,
  logoutSchema,
} from '../validation/auth.js';
import { validateBody } from '../middlewares/validateBody.js';
import {
  loginUserController,
  logoutUserController,
  refreshUsersSessionController,
  registerUserController,
} from '../controllers/auth.js';

const router = Router();

router.post(
  '/register',
  validateBody(registerUserSchema),
  registerUserController,
);
router.post('/login', validateBody(loginUserSchema), loginUserController);

router.post(
  '/refresh',
  validateBody(refreshSchema),
  refreshUsersSessionController,
);
router.post('/logout', validateBody(logoutSchema), logoutUserController);

export default router;
