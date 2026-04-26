import { Router } from 'express';

import { get_health_payload } from '#services/heartbeat';

const health_router = Router();

health_router.get('/', (req, res) => {
  res.json(get_health_payload());
});

export default health_router;
