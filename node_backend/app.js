import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import 'express-async-errors'; // must follow express, adds async error handling
import { trim_all } from 'request_trimmer';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

import consoleLogger from '#middleware/console_logger';
import auditLogger from './middleware/audit_logger.js';
import apiRoutes from './routes/index.js';
import './utils/env_loader.js';

const app = express();
const specs = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: { title: 'MLBots API', version: process.env.VERSION },
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
app.use('/api', auditLogger(), consoleLogger(), apiRoutes);

// this has to come AFTER the controllers
// if (SentryErrorHandler) SentryErrorHandler(app);

app.listen(process.env.NODE_PORT, () => {
  console.info(`🚀 Server ready at http://localhost:${process.env.NODE_PORT}/`);
});
