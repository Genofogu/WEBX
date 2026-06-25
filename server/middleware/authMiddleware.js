import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Admin from '../models/Admin.js';

const authMiddleware = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET || 'access-secret');

    if (decoded.role === 'admin') {
      req.user = await Admin.findById(decoded.id);
    } else {
      req.user = await User.findById(decoded.id);
    }

    if (!req.user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }

    req.user.role = decoded.role;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
  }
};

export default authMiddleware;
