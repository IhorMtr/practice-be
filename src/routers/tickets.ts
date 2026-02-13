import { Router } from 'express';

import {
  createTicketController,
  listTicketsController,
  getTicketByIdController,
  updateTicketByManagerController,
  updateTicketStatusController,
} from '../controllers/tickets.js';
import { authenticate } from '../middlewares/authenticate.js';
import { validateBody } from '../middlewares/validateBody.js';
import {
  createTicketSchema,
  updateTicketByManagerSchema,
  updateTicketStatusSchema,
} from '../validation/tickets.js';

const router = Router();

router.use(authenticate);

router.get('/', listTicketsController);
router.get('/:id', getTicketByIdController);

router.post('/', validateBody(createTicketSchema), createTicketController);

router.patch(
  '/:id',
  validateBody(updateTicketByManagerSchema),
  updateTicketByManagerController,
);

router.patch(
  '/:id/status',
  validateBody(updateTicketStatusSchema),
  updateTicketStatusController,
);

export default router;
