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
import type { BaseResponse, IdParams } from '../types/index.js';

export const listClientsController: RequestHandler<
  {},
  BaseResponse<any>
> = async (req, res) => {
  const search =
    typeof req.query.search === 'string' ? req.query.search : undefined;

  const clients = await listClients(search);

  const body: BaseResponse<typeof clients> = {
    success: true,
    data: clients,
    errors: null,
    message: 'Clients list',
  };

  res.status(200).json(body);
};

export const getClientByIdController: RequestHandler<
  IdParams,
  BaseResponse<any>
> = async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) throw createHttpError(400, 'Invalid client id');

  const client = await getClientById(id);
  if (!client) throw createHttpError(404, 'Client not found');

  const body: BaseResponse<typeof client> = {
    success: true,
    data: client,
    errors: null,
    message: 'Client found',
  };

  res.status(200).json(body);
};

export const createClientController: RequestHandler<
  {},
  BaseResponse<any>
> = async (req, res) => {
  const client = await createClient(req.body);

  const body: BaseResponse<typeof client> = {
    success: true,
    data: client,
    errors: null,
    message: 'Client created',
  };

  res.status(201).json(body);
};

export const updateClientController: RequestHandler<
  IdParams,
  BaseResponse<any>
> = async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) throw createHttpError(400, 'Invalid client id');

  const client = await updateClient(id, req.body);

  const body: BaseResponse<typeof client> = {
    success: true,
    data: client,
    errors: null,
    message: 'Client updated',
  };

  res.status(200).json(body);
};

export const deleteClientController: RequestHandler<
  IdParams,
  BaseResponse<null>
> = async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) throw createHttpError(400, 'Invalid client id');

  await deleteClient(id);

  const body: BaseResponse<null> = {
    success: true,
    data: null,
    errors: null,
    message: null,
  };

  res.status(200).json(body);
};
