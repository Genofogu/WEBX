import mongoose from 'mongoose';

const internshipSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a title'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    orgName: {
      type: String,
      required: [true, 'Please provide an organization name'],
      trim: true,
      maxlength: [100, 'Organization name cannot be more than 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a description'],
      maxlength: [2000, 'Description cannot be more than 2000 characters'],
    },
    role: {
      type: String,
      required: [true, 'Please provide a role'],
      trim: true,
    },
    duration: {
      type: String,
      required: [true, 'Please provide a duration'],
    },
    stipend: {
      type: String,
      required: [true, 'Please provide a stipend'],
    },
    skillsRequired: {
      type: [String],
      required: [true, 'Please provide required skills'],
    },
    contactEmail: {
      type: String,
      required: [true, 'Please provide a contact email'],
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email',
      ],
    },
    deadline: {
      type: Date,
      required: [true, 'Please provide a deadline'],
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Text index for search
internshipSchema.index({ title: 'text', orgName: 'text', role: 'text', description: 'text' });

const Internship = mongoose.model('Internship', internshipSchema);
export default Internship;
