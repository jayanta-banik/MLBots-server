import { Router } from 'express';

import { getUniversityDirectory } from '#services/universities';

const routes = Router();

routes.get('/', async (_req, res) => {
  const payload = await getUniversityDirectory();

  if (payload instanceof Error) {
    return res.status(payload.statusCode).json({ message: payload.message });
  }

  res.json(payload);
});

export default routes;
