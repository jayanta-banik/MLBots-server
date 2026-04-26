import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import 'express-async-errors'; // must follow express, adds async error handling
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { trim_all } from 'request_trimmer';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

import apiRputes from './routes/index.js';

const currentFilePath = fileURLToPath(import.meta.url);
const currentDirectoryPath = path.dirname(currentFilePath);
const envFileName = process.env.NODE_ENV === 'prod' ? '.env.prod' : '.env';
const envFile = path.join(currentDirectoryPath, envFileName);

console.info(`Loading environment variables from ${envFile}`);

dotenv.config({ path: envFile });

const app = express();
const specs = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: { title: 'MLBots API', version: '1.0.0' },
  },
  apis: ['./routes/index.js'],
});

app.use(bodyParser.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(trim_all);
app.use(
  cors({
    allowedHeaders: ['Authorization', 'baggage', 'x-correlation-id', 'Content-Type', 'sentry-trace'],
    credentials: true,
    methods: ['GET', 'OPTIONS', 'POST', 'PUT', 'PATCH', 'DELETE'],
    origin: true,
  }),
);

// Health Check Endpoint
app.get('/status', (req, res) => {
  res.status(200).json({
    ENV: process.env.ENV,
    STATUS: 'OK',
    VERSION: process.env.VERSION || 'unknown',
  });
});

// Endpoint to test error handling
app.post('/api/error', () => {
  throw new Error('This is a test error');
});

app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs));
app.use('/api', apiRputes);

// this has to come AFTER the controllers
// if (SentryErrorHandler) SentryErrorHandler(app);

app.listen(process.env.NODE_PORT, () => {
  console.info(`🚀 Server ready at http://localhost:${process.env.NODE_PORT}/`);
});
