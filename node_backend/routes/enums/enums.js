import Prisma from '@prisma/client';
import { Router } from 'express';

import { createError, send_error } from '#utils/error_utils';

const routes = Router({ mergeParams: true });

const getEnumHandler = (req, res) => {
  const { var: enumName } = req.params;

  if (!Prisma[enumName]) return send_error(res, createError(400, `Enum '${enumName}' not authorized.`));

  return res.json({ [enumName]: Object.values(Prisma[enumName]) });
};

routes.get('/:var', getEnumHandler);

export default routes;
