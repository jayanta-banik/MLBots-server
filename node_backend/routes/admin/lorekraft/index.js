import { Router } from 'express';

import { createRace, fetchRaces, fetchSkills } from '#models/lorekraft';
import { send_error } from '#utils/error_utils';
import { normalizeRacePayload, serializeRace } from '#utils/lorekraft_race_helper';

const routes = Router({ mergeParams: true });

const getOverviewHandler = (_req, res) => {
  return res.json({
    section: 'LoreKraft Admin',
    message: 'Admin access confirmed. LoreKraft management tools can be connected here.',
  });
};

const addRaceHandler = async (req, res) => {
  const [races, skills] = await Promise.all([fetchRaces(), fetchSkills()]);
  const normalizedPayload = normalizeRacePayload(req.body, { races, skills });

  if (normalizedPayload instanceof Error) return send_error(res, normalizedPayload);

  const race = await createRace(normalizedPayload);

  if (race instanceof Error) return send_error(res, race);

  return res.status(201).json({
    race: serializeRace(race),
  });
};

routes.get('/overview', getOverviewHandler);
routes.post('/races', addRaceHandler);

export default routes;
