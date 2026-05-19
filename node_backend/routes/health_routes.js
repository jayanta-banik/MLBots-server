import { Router } from 'express';

import { get_health_payload } from '#services/heartbeat';

const health_router = Router();

/**
 * @openapi
 * /api/health:
 *   get:
 *     tags:
 *       - System
 *     summary: Application health payload from the heartbeat service.
 *     responses:
 *       200:
 *         description: Health payload returned successfully.
 */
health_router.get('/', (req, res) => {
  res.json(get_health_payload());
});

export default health_router;
