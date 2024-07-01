// middlewares/authMiddleware.js

import { verifyToken } from '../utils/tokenUtils.js';

export const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ error: 'No token provided' });

  const token = authHeader.split(' ')[1]; 
  if (!token) return res.status(401).json({ error: 'Invalid token format' });

  try {
    const decoded = await verifyToken(token);
    req.userId = decoded.id; 
    next();
  } catch (error) {
    if (error.message === 'Token expired') {
      return res.status(401).json({ error: 'Token expired' });
    }
    return res.status(401).json({ error: 'Failed to authenticate token' });
  }
};
