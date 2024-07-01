// utils/tokenUtils.js

import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()
const JWT_SECRET = process.env.VITE_JWT_SECRET

export const verifyToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: 'No token provided' });
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Token expired' });
      }
      return res.status(401).json({ error: 'Failed to authenticate token' });
    }
    req.userId = decoded.id;
    next();
  });
};


export function generateToken(payload, expiresIn = '1h') {
  try {
    return jwt.sign(payload, JWT_SECRET, { expiresIn })
  } catch (error) {
    throw new Error('Error generating token')
  }
}
