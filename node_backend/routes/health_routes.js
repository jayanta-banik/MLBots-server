import { Router } from 'express';

import { get_health_payload } from '#service/health_service';

const health_router = Router();

health_router.get('/', (req, res) => {
  res.json(get_health_payload());
});

export default health_router;
