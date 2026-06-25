import User from '../models/User.js';
import Application from '../models/Application.js';
import Internship from '../models/Internship.js';
import { z } from 'zod';

const profileUpdateSchema = z.object({
  name: z.string().min(2).optional(),
  bio: z.string().max(500).optional(),
  skills: z.array(z.string()).optional(),
  college: z.string().optional(),
  year: z.string().optional(),
  avatar: z.string().url().optional(),
  darkMode: z.boolean().optional(),
});

const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const validatedData = profileUpdateSchema.parse(req.body);
    const user = await User.findByIdAndUpdate(req.user.id, validatedData, {
      new: true,
      runValidators: true,
    });
    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

const applyToInternship = async (req, res, next) => {
  try {
    const { internshipId, coverLetter } = req.body;

    const internship = await Internship.findById(internshipId);
    if (!internship || !internship.isActive) {
      return res.status(404).json({ success: false, message: 'Internship not found or inactive' });
    }

    const application = await Application.create({
      user: req.user.id,
      internship: internshipId,
      coverLetter,
    });

    res.status(201).json({ success: true, application });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'You have already applied to this internship' });
    }
    next(error);
  }
};

const getMyApplications = async (req, res, next) => {
  try {
    const applications = await Application.find({ user: req.user.id })
      .populate('internship')
      .sort('-appliedAt');
    res.json({ success: true, applications });
  } catch (error) {
    next(error);
  }
};

const toggleSaveInternship = async (req, res, next) => {
  try {
    const internshipId = req.body.internshipId || req.body.listing_id || req.params.internshipId;
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (!internshipId) {
      return res.status(400).json({ success: false, message: 'Internship ID is required' });
    }

    const index = user.savedInternships.indexOf(internshipId);
    if (index > -1) {
      user.savedInternships.splice(index, 1);
    } else {
      user.savedInternships.push(internshipId);
    }

    await user.save();
    res.json({ success: true, savedInternships: user.savedInternships });
  } catch (error) {
    next(error);
  }
};

const getSavedInternships = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate('savedInternships');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, savedInternships: user.savedInternships });
  } catch (error) {
    next(error);
  }
};

export { getProfile, updateProfile, applyToInternship, getMyApplications, toggleSaveInternship, getSavedInternships };
