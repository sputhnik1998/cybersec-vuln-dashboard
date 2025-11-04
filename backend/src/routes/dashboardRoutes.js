const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { cacheMiddleware } = require('../middleware/cacheMiddleware');

/**
 * Dashboard Routes
 * Provides unified aggregated data for dashboard cards with caching
 */

// Get unified dashboard aggregates (cached for 30 minutes)
router.get(
  '/aggregates',
  cacheMiddleware('dashboard:aggregates', 1800), // 30 minutes TTL
  dashboardController.getAggregates
);

// Cache management endpoints
router.post('/cache/invalidate', dashboardController.invalidateCache);
router.post('/cache/clear', dashboardController.clearAllCache);
router.get('/cache/stats', dashboardController.getCacheStats);

// Health check endpoint (no caching)
router.get('/health', dashboardController.healthCheck);

module.exports = router;
