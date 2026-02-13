import createHttpError from 'http-errors';
import { ClientsCollection } from '../db/models/client.js';
import { CreateClientPayload, UpdateClientPayload } from '../types/index.js';

export const listClients = async (search?: string) => {
  const filter: any = {};

  if (search && search.trim() !== '') {
    const q = search.trim();
    filter.$or = [
      { fullName: { $regex: q, $options: 'i' } },
      { email: { $regex: q, $options: 'i' } },
    ];
  }

  return ClientsCollection.find(filter).sort({ createdAt: -1 });
};

export const getClientById = async (id: string) => {
  return ClientsCollection.findById(id);
};

export const createClient = async (payload: CreateClientPayload) => {
  try {
    return await ClientsCollection.create(payload);
  } catch (err: any) {
    if (err?.code === 11000) {
      throw createHttpError(409, 'Client with this email already exists');
    }
    throw err;
  }
};

export const updateClient = async (
  id: string,
  payload: UpdateClientPayload,
) => {
  try {
    const updated = await ClientsCollection.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
    });

    if (!updated) throw createHttpError(404, 'Client not found');
    return updated;
  } catch (err: any) {
    if (err?.code === 11000) {
      throw createHttpError(409, 'Client with this email already exists');
    }
    throw err;
  }
};

export const deleteClient = async (id: string) => {
  const deleted = await ClientsCollection.findByIdAndDelete(id);
  if (!deleted) throw createHttpError(404, 'Client not found');
  return;
};
