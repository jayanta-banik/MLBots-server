import { Router } from 'express';

import { fetchRaces, fetchSkills } from '#models/lorekraft';
import { send_error } from '#utils/error_utils';
import { serializeRace, serializeSkill } from '#utils/lorekraft_race_helper';

const routes = Router({ mergeParams: true });

const getRaceDirectoryHandler = async (_req, res) => {
  const races = await fetchRaces();

  if (races instanceof Error) return send_error(res, races);

  return res.json({
    races: races.map(serializeRace),
  });
};

const getSkillCatalogHandler = async (_req, res) => {
  const skills = await fetchSkills();

  if (skills instanceof Error) return send_error(res, skills);

  return res.json({
    skills: skills.map(serializeSkill),
  });
};

routes.get('/races', getRaceDirectoryHandler);
routes.get('/skills', getSkillCatalogHandler);

export default routes;
