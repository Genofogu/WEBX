import express from 'express';
import {
  getProfile,
  updateProfile,
  applyToInternship,
  getMyApplications,
} from '../controllers/userController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.post('/apply', applyToInternship);
router.get('/applications', getMyApplications);
router.post('/saved', toggleSaveInternship);
router.get('/saved/:userId', getSavedInternships);
router.delete('/saved/:userId/:internshipId', toggleSaveInternship);

export default router;
