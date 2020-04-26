import jwt from 'jsonwebtoken';
import { promisify } from 'util';

const SECRET = process.env.APP_SECRET;

export default async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    req.auth = false;
    return next();
  }

  const [bearer, token] = authorization.split(' ');

  if (bearer !== 'Bearer') {
    return res.status(401).json({ error: 'Token badly formatted.' });
  }

  try {
    const payload = await promisify(jwt.verify)(token, SECRET);
    req.auth = payload;
    return next();
  } catch (error) {
    return res.status(401).json({ error: 'Token invalid.' });
  }
};
