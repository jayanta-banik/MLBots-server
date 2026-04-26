import { verifyAuthToken } from '#utils/auth_utils';

export function requireLogin(req, res, next) {
  const authorization_header = req.headers.authorization;

  if (!authorization_header?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authentication is required.' });
  }

  const token = authorization_header.replace('Bearer ', '').trim();
  const payload = verifyAuthToken(token);

  if (payload instanceof Error) return res.status(403).json({ message: 'The current session is invalid.' });

  res.locals.auth = {
    token,
    user_id: Number(payload.sub),
  };
  next();
}
