import { Router } from 'express';

import {
  listClientsController,
  getClientByIdController,
  createClientController,
  updateClientController,
  deleteClientController,
} from '../controllers/clients.js';
import { authenticate } from '../middlewares/authenticate.js';
import { authorize } from '../middlewares/authorize.js';
import { validateBody } from '../middlewares/validateBody.js';

import {
  createClientSchema,
  updateClientSchema,
} from '../validation/clients.js';

const router = Router();

router.use(authenticate);
router.use(authorize('admin', 'manager'));

router.get('/', listClientsController);
router.get('/:id', getClientByIdController);
router.post('/', validateBody(createClientSchema), createClientController);
router.patch('/:id', validateBody(updateClientSchema), updateClientController);
router.delete('/:id', deleteClientController);

export default router;
