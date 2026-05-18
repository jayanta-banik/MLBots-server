import Prisma from '@prisma/client';

export function requireAdmin(req, res, next) {
  if (res.locals.userRole !== Prisma.UserRole.ADMIN) {
    return res.status(403).json({ message: 'Admin privileges are required.' });
  }
  next();
}
