import mongoose from 'mongoose';
import winston from 'winston';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/buildx');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error instanceof Error ? error.message : String(error)}`);
    // Don't exit process in this environment, just log it
  }
};

export default connectDB;
