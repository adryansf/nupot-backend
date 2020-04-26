import jwt from 'jsonwebtoken';
import { promisify } from 'util';

const SECRET = process.env.SECRET

export default (req, res, next) => {
  const { authorization } = req.headers
  if (!authorization) {
    req.auth = false
    return next();
  }

  const [bearer, token] = authHeader.split(' ');

  if (bearer !== 'Bearer') {
    return res.status(401).json({ error: 'Token badly formatted.' });
  }

  try {
    const payload = await promisify(jwt.verify)(token, SECRET)
    req.auth = payload
    return next()
  } catch (error) {
    return res.status(401).json({ error: 'Token invalid.' });
  }
}
