import express from 'express';
import {
  getDashboardStats,
  getAllUsers,
  getAllApplications,
  updateApplicationStatus,
  createInternship,
} from '../controllers/adminController.js';
import { adminLogin } from '../controllers/adminAuthController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import adminMiddleware from '../middleware/adminMiddleware.js';

const router = express.Router();

router.post('/login', adminLogin);

router.use(authMiddleware);
router.use(adminMiddleware);

router.get('/dashboard', getDashboardStats);
router.get('/users', getAllUsers);
router.get('/applications', getAllApplications);
router.put('/application/:id/status', updateApplicationStatus);
router.post('/internship', createInternship);

export default router;
