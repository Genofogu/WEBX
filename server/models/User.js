import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
      maxlength: [50, 'Name cannot be more than 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email',
      ],
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },
    role: {
      type: String,
      enum: ['user'],
      default: 'user',
    },
    profile: {
      bio: {
        type: String,
        maxlength: [500, 'Bio cannot be more than 500 characters'],
      },
      skills: {
        type: [String],
        default: [],
      },
      college: {
        type: String,
        trim: true,
      },
      year: {
        type: String,
        trim: true,
      },
      avatar: {
        type: String,
        default: 'https://picsum.photos/seed/avatar/200/200',
      },
    },
    darkMode: {
      type: Boolean,
      default: false,
    },
    savedInternships: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Internship',
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Encrypt password using bcrypt
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;
