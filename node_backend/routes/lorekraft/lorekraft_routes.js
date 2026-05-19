import { Router } from 'express';

import { fetchRaces, fetchSkills } from '#models/lorekraft';
import { send_error } from '#utils/error_utils';

import { serializeRace, serializeSkill } from './lorekraft_route_helper.js';

const routes = Router({ mergeParams: true });

const getRaceDirectoryHandler = async (_req, res) => {
  const races = await fetchRaces();

  if (races instanceof Error) return send_error(res, races);

  return res.json({
    races: races.map(serializeRace),
  });
};

/**
 * @openapi
 * /api/lorekraft/races:
 *   get:
 *     tags:
 *       - LoreKraft
 *     summary: List LoreKraft races.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Race directory returned successfully.
 *       401:
 *         description: Authentication required.
 */
const getSkillCatalogHandler = async (_req, res) => {
  const skills = await fetchSkills();

  if (skills instanceof Error) return send_error(res, skills);

  return res.json({
    skills: skills.map(serializeSkill),
  });
};

/**
 * @openapi
 * /api/lorekraft/skills:
 *   get:
 *     tags:
 *       - LoreKraft
 *     summary: List LoreKraft skills.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Skill catalog returned successfully.
 *       401:
 *         description: Authentication required.
 */
routes.get('/races', getRaceDirectoryHandler);
routes.get('/skills', getSkillCatalogHandler);

export default routes;
