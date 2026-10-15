import jwt from 'jsonwebtoken';

export const genToken = (userId) => {
  const secret = process.env.JWT_SECRET || 'fallback_secret_key_12345';
  return jwt.sign({ id: userId }, secret, {
    expiresIn: '7d',
  });
};