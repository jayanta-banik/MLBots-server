import { Router } from 'express';

import { createRace, fetchRaces, fetchSkills } from '#models/lorekraft';
import { send_error } from '#utils/error_utils';

import { normalizeRacePayload, serializeRace } from './lorekraft_admin_helper.js';

const routes = Router({ mergeParams: true });

/**
 * @openapi
 * /api/lorekraft/admin/overview:
 *   get:
 *     tags:
 *       - LoreKraft Admin
 *     summary: LoreKraft admin overview.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Admin overview returned successfully.
 *       401:
 *         description: Authentication required.
 *       403:
 *         description: Admin role required.
 */
const getOverviewHandler = (_req, res) => res.json({
  section: 'LoreKraft Admin',
  message: 'Admin access confirmed. LoreKraft management tools can be connected here.',
});

/**
 * @openapi
 * /api/lorekraft/admin/races:
 *   post:
 *     tags:
 *       - LoreKraft Admin
 *     summary: Create a LoreKraft race.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Race created successfully.
 *       400:
 *         description: Invalid payload.
 *       401:
 *         description: Authentication required.
 *       403:
 *         description: Admin role required.
 */
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
