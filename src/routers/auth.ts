import { Router } from 'express';

import { registerUserSchema, loginUserSchema } from '../validation/auth.js';
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

router.post('/logout', logoutUserController);
router.post('/refresh', refreshUsersSessionController);

export default router;
