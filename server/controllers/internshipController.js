import Internship from '../models/Internship.js';

const getAllInternships = async (req, res, next) => {
  try {
    const { search, skills, limit = 10, page = 1 } = req.query;
    const query = { isActive: true };

    if (search) {
      query.$text = { $search: search };
    }

    if (skills) {
      const skillsArray = skills.split(',').map((s) => s.trim());
      query.skillsRequired = { $in: skillsArray };
    }

    const skip = (page - 1) * limit;
    const internships = await Internship.find(query)
      .sort('-createdAt')
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Internship.countDocuments(query);

    res.json({
      success: true,
      internships,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    next(error);
  }
};

const getInternshipById = async (req, res, next) => {
  try {
    const internship = await Internship.findById(req.params.id);
    if (!internship || !internship.isActive) {
      return res.status(404).json({ success: false, message: 'Internship not found' });
    }
    res.json({ success: true, internship });
  } catch (error) {
    next(error);
  }
};

export { getAllInternships, getInternshipById };
