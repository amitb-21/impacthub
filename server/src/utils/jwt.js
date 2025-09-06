import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'changeme';
const JWT_EXPIRES = process.env.JWT_EXPIRES || '7d';

export function signJwt(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES });
}

export function verifyJwt(token) {
  return jwt.verify(token, JWT_SECRET);
}
