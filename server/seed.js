import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Admin from './models/Admin.js';
import Internship from './models/Internship.js';

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/buildx');
    console.log('Connected to MongoDB for seeding...');

    // Clear existing data
    await Admin.deleteMany();
    await Internship.deleteMany();

    // Create Admin
    const admin = await Admin.create({
      name: 'Super Admin',
      email: 'admin@buildx.com',
      password: 'password123', // Will be hashed by pre-save hook
    });
    console.log('Admin created: admin@buildx.com / password123');

    // Create Sample Internships
    const internships = [
      {
        title: 'Frontend Developer Intern',
        orgName: 'TechCorp',
        description: 'Join our team as a Frontend Developer Intern and work on cutting-edge React projects.',
        role: 'Frontend Developer',
        duration: '3 Months',
        stipend: '$1000/month',
        skillsRequired: ['React', 'TypeScript', 'Tailwind CSS'],
        contactEmail: 'hr@techcorp.com',
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        postedBy: admin._id,
      },
      {
        title: 'Backend Engineering Intern',
        orgName: 'DataSystems',
        description: 'Help us build scalable backend services using Node.js and MongoDB.',
        role: 'Backend Engineer',
        duration: '6 Months',
        stipend: '$1200/month',
        skillsRequired: ['Node.js', 'Express', 'MongoDB'],
        contactEmail: 'jobs@datasystems.com',
        deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 days from now
        postedBy: admin._id,
      },
      {
        title: 'UI/UX Design Intern',
        orgName: 'CreativeStudio',
        description: 'Work with our design team to create beautiful and intuitive user interfaces.',
        role: 'UI/UX Designer',
        duration: '4 Months',
        stipend: '$800/month',
        skillsRequired: ['Figma', 'Adobe XD', 'Prototyping'],
        contactEmail: 'design@creativestudio.com',
        deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000), // 20 days from now
        postedBy: admin._id,
      },
    ];

    await Internship.insertMany(internships);
    console.log('Sample internships created.');

    console.log('Seeding completed successfully.');
    process.exit();
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
