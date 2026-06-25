import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer } from 'http';
import { Server } from 'socket.io';
import connectDB from './config/db.js';
import validateEnv from './config/env.js';
import configurePassport from './config/passport.js';
import errorHandler from './middleware/errorHandler.js';
import { generalLimiter } from './middleware/rateLimiter.js';

// Routes
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import internshipRoutes from './routes/internshipRoutes.js';

import { createServer as createViteServer } from 'vite';

async function startServer() {
  try {
    // Load env vars
    dotenv.config();

    // Validate env vars
    validateEnv();

    // Connect to database
    connectDB();

    // Passport config
    configurePassport();
  } catch (err) {
    console.error('CRITICAL ERROR DURING INITIALIZATION:', err);
  }

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const app = express();
  app.set('trust proxy', 1);
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
    },
  });

  // Security Middleware
  app.use(helmet({
    contentSecurityPolicy: false, // Disable CSP for development to allow Vite
  }));
  app.use(mongoSanitize());
  app.use(hpp());
  app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
  }));

  // Body parser
  app.use(express.json({ limit: '10kb' }));
  app.use(cookieParser());

  // Rate limiting
  app.use('/api', generalLimiter);

  // API Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/user', userRoutes);
  app.use('/api/admin', adminRoutes);
  app.use('/api/listings', internshipRoutes);
  app.use('/api/internships', internshipRoutes);
  app.use('/api/apply', userRoutes);
  app.use('/api/applications', userRoutes);
  app.use('/api/dashboard', adminRoutes);
  app.use('/api/students', adminRoutes);
  app.use('/api/saved', userRoutes); // Mapping /api/saved to userRoutes

  // Socket.IO
  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Error Handler
  app.use(errorHandler);

  const PORT = 3000;
  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });
}

startServer();
