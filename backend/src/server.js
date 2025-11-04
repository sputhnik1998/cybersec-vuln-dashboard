require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const vulnerabilityRoutes = require('./routes/vulnerabilityRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const { warmCache } = require('./middleware/cacheMiddleware');
const dashboardService = require('./services/dashboardService');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB().then(() => {
  // Optional: Warm cache on startup to improve first request performance
  console.log('[Cache] Starting cache warm-up...');
  warmCache(
    'dashboard:aggregates:{}',
    () => dashboardService.getDashboardAggregates({ timelineMonths: 12 }),
    1800 // 30 minutes TTL
  ).then((success) => {
    if (success) {
      console.log('[Cache] Dashboard cache warmed successfully');
    }
  }).catch((err) => {
    console.error('[Cache] Failed to warm cache, will populate on first request:', err.message);
  });
}).catch((err) => {
  console.error('[Database] Connection failed:', err);
  process.exit(1);
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/vulnerabilities', vulnerabilityRoutes);
app.use('/api/dashboard', dashboardRoutes);
console.log('[Routes] Registered: /api/vulnerabilities, /api/dashboard');

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
