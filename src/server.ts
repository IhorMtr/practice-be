import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import pino from 'pino';
import { pinoHttp } from 'pino-http';

import authRouter from './routers/auth.js';
import usersRouter from './routers/users.js';
import clientsRouter from './routers/clients.js';
import ticketsRouter from './routers/tickets.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { allowedOrigins } from './constants/constants.js';

dotenv.config();

const PORT = Number(process.env.PORT) || 3000;

export function setupServer() {
  const app = express();
  app.use(
    cors({
      origin: allowedOrigins,
      credentials: true,
    }),
  );

  app.use(express.json());

  app.use(
    pinoHttp({
      logger: pino({
        transport: {
          target: 'pino-pretty',
          options: { colorize: true },
        },
      }),
      autoLogging: {
        ignore: (req) => req.url === '/ping',
      },
    }),
  );

  app.get('/ping', (_req, res) => {
    res.status(200).json({ status: 'ok' });
  });

  app.use('/api/auth', authRouter);
  app.use('/api/users', usersRouter);
  app.use('/api/clients', clientsRouter);
  app.use('/api/tickets', ticketsRouter);

  app.use(notFoundHandler);

  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
