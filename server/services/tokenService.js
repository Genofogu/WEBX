import jwt from 'jsonwebtoken';
import RefreshToken from '../models/RefreshToken.js';

const generateAccessToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_ACCESS_SECRET || 'access-secret', {
    expiresIn: process.env.JWT_ACCESS_EXPIRY || '15m',
  });
};

const generateRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET || 'refresh-secret', {
    expiresIn: process.env.JWT_REFRESH_EXPIRY || '7d',
  });
};

const verifyAccessToken = (token) => {
  return jwt.verify(token, process.env.JWT_ACCESS_SECRET || 'access-secret');
};

const verifyRefreshToken = (token) => {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET || 'refresh-secret');
};

const saveRefreshToken = async (token, userId, userType) => {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // Default 7 days

  await RefreshToken.create({
    token,
    userId,
    userType,
    expiresAt,
  });
};

const deleteRefreshToken = async (token) => {
  await RefreshToken.deleteOne({ token });
};

const deleteAllUserTokens = async (userId) => {
  await RefreshToken.deleteMany({ userId });
};

export {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  saveRefreshToken,
  deleteRefreshToken,
  deleteAllUserTokens,
};
