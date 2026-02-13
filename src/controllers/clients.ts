import type { RequestHandler } from 'express';
import createHttpError from 'http-errors';
import { isValidObjectId } from 'mongoose';

import {
  listClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient,
} from '../services/clients.js';
import { IdParams } from '../types/index.js';

export const listClientsController: RequestHandler = async (req, res) => {
  const search =
    typeof req.query.search === 'string' ? req.query.search : undefined;

  const clients = await listClients(search);

  res.json({
    status: 200,
    message: 'Clients list',
    data: clients,
  });
};

export const getClientByIdController: RequestHandler<IdParams> = async (
  req,
  res,
) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) throw createHttpError(400, 'Invalid client id');

  const client = await getClientById(id);
  if (!client) throw createHttpError(404, 'Client not found');

  res.json({
    status: 200,
    message: 'Client found',
    data: client,
  });
};

export const createClientController: RequestHandler = async (req, res) => {
  const client = await createClient(req.body);

  res.status(201).json({
    status: 201,
    message: 'Client created',
    data: client,
  });
};

export const updateClientController: RequestHandler<IdParams> = async (
  req,
  res,
) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) throw createHttpError(400, 'Invalid client id');

  const client = await updateClient(id, req.body);

  res.json({
    status: 200,
    message: 'Client updated',
    data: client,
  });
};

export const deleteClientController: RequestHandler<IdParams> = async (
  req,
  res,
) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) throw createHttpError(400, 'Invalid client id');

  await deleteClient(id);

  res.status(204).send();
};
