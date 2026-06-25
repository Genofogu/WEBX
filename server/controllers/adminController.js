import User from '../models/User.js';
import Internship from '../models/Internship.js';
import Application from '../models/Application.js';
import { z } from 'zod';

const internshipSchema = z.object({
  title: z.string().min(2).max(100),
  orgName: z.string().min(2).max(100),
  description: z.string().min(10).max(2000),
  role: z.string().min(2),
  duration: z.string(),
  stipend: z.string(),
  skillsRequired: z.array(z.string()),
  contactEmail: z.string().email(),
  deadline: z.string().datetime(),
});

const getDashboardStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalInternships = await Internship.countDocuments();
    const totalApplications = await Application.countDocuments();
    const pendingApplications = await Application.countDocuments({ status: 'pending' });

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalInternships,
        totalApplications,
        pendingApplications,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().sort('-createdAt');
    res.json({ success: true, users });
  } catch (error) {
    next(error);
  }
};

const getAllApplications = async (req, res, next) => {
  try {
    const applications = await Application.find()
      .populate('user', 'name email profile')
      .populate('internship', 'title orgName')
      .sort('-appliedAt');
    res.json({ success: true, applications });
  } catch (error) {
    next(error);
  }
};

const updateApplicationStatus = async (req, res, next) => {
  try {
    const { status, adminNote } = req.body;
    const application = await Application.findByIdAndUpdate(
      req.params.id,
      { status, adminNote },
      { new: true, runValidators: true }
    );
    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }
    res.json({ success: true, application });
  } catch (error) {
    next(error);
  }
};

const createInternship = async (req, res, next) => {
  try {
    const validatedData = internshipSchema.parse(req.body);
    const internship = await Internship.create({
      ...validatedData,
      postedBy: req.user.id,
    });
    res.status(201).json({ success: true, internship });
  } catch (error) {
    next(error);
  }
};

export {
  getDashboardStats,
  getAllUsers,
  getAllApplications,
  updateApplicationStatus,
  createInternship,
};
