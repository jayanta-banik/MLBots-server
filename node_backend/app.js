import dotenv from 'dotenv';
import express from 'express';

import bodyParser from 'body-parser';
import cors from 'cors';
import 'express-async-errors'; // must follow express, adds async error handling
import { trim_all } from 'request_trimmer';

dotenv.config();

const DEFAULT_NODE_PORT = Number.parseInt(process.env.NODE_PORT ?? '3000', 10);

const app = express();

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
app.get('/api/status', (req, res) => {
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

// this has to come AFTER the controllers
// if (SentryErrorHandler) SentryErrorHandler(app);

app.listen(DEFAULT_NODE_PORT, () => {
  console.info(`🚀 Server ready at http://localhost:${DEFAULT_NODE_PORT}/`);
});
