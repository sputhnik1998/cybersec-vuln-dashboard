require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const vulnerabilityRoutes = require('./routes/vulnerabilityRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const { warmCache } = require('./middleware/cacheMiddleware');
const dashboardService = require('./services/dashboardService');
const { createLogger } = require('./utils/logger');

const logger = createLogger('Server');
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
if (process.env.LOG_LEVEL === 'DEBUG') {
  app.use((req, res, next) => {
    logger.debug(`${req.method} ${req.path}`, { query: req.query });
    next();
  });
}

// Routes
app.use('/api/vulnerabilities', vulnerabilityRoutes);
app.use('/api/dashboard', dashboardRoutes);
logger.info('Routes registered: /api/vulnerabilities, /api/dashboard');

// Root route - for Render health checks
app.get('/', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Cybersecurity Vulnerability Dashboard API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      vulnerabilities: '/api/vulnerabilities',
      dashboard: '/api/dashboard'
    }
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// 404 handler
app.use((req, res) => {
  logger.warn('Route not found', { path: req.path, method: req.method });
  res.status(404).json({ message: 'Route not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error('Unhandled error', { error: err.message, stack: err.stack });
  res.status(500).json({ message: 'Internal server error' });
});

// Connect to MongoDB and start server
connectDB()
  .then(() => {
    logger.info('Database connected successfully');

    // Warm cache on startup
    logger.info('Starting cache warm-up');
    return warmCache(
      'dashboard:aggregates:{}',
      () => dashboardService.getDashboardAggregates({ timelineMonths: 12 }),
      1800
    );
  })
  .then((success) => {
    if (success) {
      logger.info('Cache warmed successfully');
    } else {
      logger.warn('Cache warm-up failed, will populate on first request');
    }

    // Start server - bind to 0.0.0.0 for cloud deployment
    app.listen(PORT, '0.0.0.0', () => {
      logger.info(`Server running on port ${PORT}`);
      logger.info(`Log level: ${process.env.LOG_LEVEL || 'INFO'}`);
    });
  })
  .catch((err) => {
    logger.error('Failed to start server', { error: err.message });
    process.exit(1);
  });
