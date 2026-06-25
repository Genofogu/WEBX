import Admin from '../models/Admin.js';
import {
  generateAccessToken,
  generateRefreshToken,
  saveRefreshToken,
} from '../services/tokenService.js';
import { z } from 'zod';

const adminLoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  secretKey: z.string().min(10, 'Admin secret key must be at least 10 characters'),
});

const adminLogin = async (req, res, next) => {
  try {
    const validatedData = adminLoginSchema.parse(req.body);
    const { email, password, secretKey } = validatedData;

    if (secretKey !== process.env.ADMIN_SECRET_KEY) {
      return res.status(401).json({ success: false, message: 'Invalid admin secret key' });
    }

    const admin = await Admin.findOne({ email }).select('+password');
    if (!admin || !(await admin.matchPassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid admin credentials' });
    }

    const accessToken = generateAccessToken({ id: admin._id, role: 'admin' });
    const refreshToken = generateRefreshToken({ id: admin._id, role: 'admin' });

    await saveRefreshToken(refreshToken, admin._id, 'Admin');

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({
      success: true,
      accessToken,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

export { adminLogin };
