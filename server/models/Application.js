import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    internship: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Internship',
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    coverLetter: {
      type: String,
      maxlength: [2000, 'Cover letter cannot be more than 2000 characters'],
    },
    adminNote: {
      type: String,
      maxlength: [500, 'Admin note cannot be more than 500 characters'],
    },
    appliedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Compound unique index to prevent duplicate applications
applicationSchema.index({ user: 1, internship: 1 }, { unique: true });

const Application = mongoose.model('Application', applicationSchema);
export default Application;
