import { model, Schema } from 'mongoose';
import type { Client } from '../../types/index.js';

const clientSchema = new Schema<Client>(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    notes: { type: String, default: null },
  },
  { timestamps: true, versionKey: false },
);

clientSchema.index({ email: 1 }, { unique: true });

export const ClientsCollection = model<Client>('client', clientSchema);
