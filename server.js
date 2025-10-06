import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import './config/dbconfig.js'; // 👈 Import database setup (auto creates DB + tables)

import authRoutes from './routes/authRoutes.js';
import businessRoutes from './routes/businessRoutes.js';
import freelancerRoutes from './routes/freelancerRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import fundingRoutes from './routes/fundingRoutes.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/business', businessRoutes);
app.use('/api/freelancer', freelancerRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/funding', fundingRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok',
    message: 'Kasi Konnect API is running',
    timestamp: new Date().toISOString()
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Kasi Konnect API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      business: '/api/business',
      freelancer: '/api/freelancer',
      jobs: '/api/jobs',
      funding: '/api/funding'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
app.listen(PORT, () => {
  console.log('=================================');
  console.log('   Kasi Konnect API Server');
  console.log('=================================');
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Database: ${process.env.DB_NAME || 'kasi_konnect'}`);
  console.log('=================================');
});

export default app;
