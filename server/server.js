import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import {
  errorHandler,
  notFoundHandler,
  requestLogger,
} from './middleware/errorHandler.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import masterRoutes from './routes/masterRoutes.js';

// Import models to register them with Mongoose
import User from './models/User.js';
import Event from './models/Event.js';
import Notice from './models/Notice.js';
import Admin from './models/Admin.js';
import Cluster from './models/Cluster.js';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// ===== MIDDLEWARE =====

// CORS configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Request logger
app.use(requestLogger);

// ===== API ROUTES =====

// Health check endpoint
app.get('/api/health', (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// Auth routes
app.use('/api/auth', authRoutes);

// User routes
app.use('/api/users', userRoutes);

// Admin routes
app.use('/api/admin', adminRoutes);

// Master routes
app.use('/api/master', masterRoutes);

// ===== ERROR HANDLING =====

// 404 handler for undefined routes
app.use(notFoundHandler);

// Global error handler (must be last)
app.use(errorHandler);

// ===== START SERVER =====

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║    Coding Club Backend Server          ║
╠════════════════════════════════════════╣
║  Status: ✓ Running                     ║
║  Port: ${PORT.toString().padEnd(31)} ║
║  Environment: ${NODE_ENV.padEnd(23)} ║
║  URL: http://localhost:${PORT.toString().padEnd(25)} ║
║  CORS: ${process.env.CORS_ORIGIN?.padEnd(29)} ║
╚════════════════════════════════════════╝
  `);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  process.exit(1);
});

export default app;
