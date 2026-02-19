import createHttpError from 'http-errors';
import { isValidObjectId } from 'mongoose';

import type { ListTicketsOpts } from '../../types/index.js';
import { escapeRegExp } from '../../utils/mongoose-ids.js';

export const buildTicketsFilter = (opts: ListTicketsOpts) => {
  const filter: Record<string, unknown> = {};

  if (opts.status) filter.status = opts.status;
  if (opts.priority) filter.priority = opts.priority;

  if (opts.clientId) {
    if (!isValidObjectId(opts.clientId))
      throw createHttpError(400, 'Invalid clientId');
    filter.clientId = opts.clientId;
  }

  if (opts.search?.trim()) {
    const q = escapeRegExp(opts.search.trim());
    filter.$or = [
      { deviceType: { $regex: q, $options: 'i' } },
      { problemDescription: { $regex: q, $options: 'i' } },
    ];
  }

  if (opts.role === 'technician') {
    filter.assignedTechnicianId = opts.actorId;
  }

  return filter;
};
