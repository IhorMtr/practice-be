import { model, Schema } from 'mongoose';
import type { Ticket, TicketHistoryItem } from '../../types/index.js';
import { TICKET_PRIORITIES, TICKET_STATUSES } from '../../types/index.js';

const historySchema = new Schema<TicketHistoryItem>(
  {
    at: { type: Date, required: true, default: () => new Date() },
    actorId: { type: Schema.Types.ObjectId, required: true, ref: 'user' },
    action: {
      type: String,
      required: true,
      enum: [
        'created',
        'status_changed',
        'technician_assigned',
        'cost_updated',
        'comment',
      ],
    },
    fromStatus: { type: String, enum: TICKET_STATUSES },
    toStatus: { type: String, enum: TICKET_STATUSES },
    comment: { type: String },
  },
  { _id: false },
);

const ticketSchema = new Schema<Ticket>(
  {
    clientId: { type: Schema.Types.ObjectId, ref: 'client', required: true },
    deviceType: { type: String, required: true, trim: true },
    problemDescription: { type: String, required: true, trim: true },

    priority: {
      type: String,
      enum: TICKET_PRIORITIES,
      required: true,
      default: 'medium',
    },
    status: {
      type: String,
      enum: TICKET_STATUSES,
      required: true,
      default: 'new',
    },

    assignedTechnicianId: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      default: null,
    },

    estimatedCost: { type: Number, default: null },
    finalCost: { type: Number, default: null },

    history: { type: [historySchema], required: true, default: [] },
  },
  { timestamps: true, versionKey: false },
);

ticketSchema.index({ clientId: 1, createdAt: -1 });
ticketSchema.index({ assignedTechnicianId: 1, status: 1 });

export const TicketsCollection = model<Ticket>('ticket', ticketSchema);
