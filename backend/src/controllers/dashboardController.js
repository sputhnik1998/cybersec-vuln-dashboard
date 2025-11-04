const dashboardService = require('../services/dashboardService');
const { invalidateCache, clearCache, getCacheStats } = require('../middleware/cacheMiddleware');
const { createLogger } = require('../utils/logger');

const logger = createLogger('DashboardController');

/**
 * Get unified dashboard aggregates (cached for 30 minutes)
 */
exports.getAggregates = async (req, res) => {
  try {
    const { timelineMonths } = req.query;
    const options = {
      timelineMonths: timelineMonths ? parseInt(timelineMonths) : 12,
    };

    logger.debug('Fetching dashboard aggregates', options);
    const dashboardData = await dashboardService.getDashboardAggregates(options);
    logger.debug('Dashboard aggregates fetched successfully');

    res.json(dashboardData);
  } catch (error) {
    logger.error('Error fetching dashboard aggregates', { error: error.message });
    res.status(500).json({
      message: 'Failed to fetch dashboard aggregates',
      error: error.message,
    });
  }
};

/**
 * Invalidate dashboard cache
 */
exports.invalidateCache = async (req, res) => {
  try {
    const { pattern = 'dashboard:*' } = req.body;
    logger.info('Invalidating cache', { pattern });

    const deletedCount = invalidateCache(pattern);
    logger.info('Cache invalidated', { deletedKeys: deletedCount });

    res.json({
      success: true,
      message: `Cache invalidated for pattern: ${pattern}`,
      deletedKeys: deletedCount,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    logger.error('Error invalidating cache', { error: error.message });
    res.status(500).json({
      success: false,
      message: 'Failed to invalidate cache',
      error: error.message,
    });
  }
};

/**
 * Clear all cache
 */
exports.clearAllCache = async (req, res) => {
  try {
    logger.warn('Clearing all cache');
    const success = clearCache();

    res.json({
      success,
      message: success ? 'All cache cleared successfully' : 'Failed to clear cache',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    logger.error('Error clearing cache', { error: error.message });
    res.status(500).json({
      success: false,
      message: 'Failed to clear cache',
      error: error.message,
    });
  }
};

/**
 * Get cache statistics
 */
exports.getCacheStats = async (req, res) => {
  try {
    const stats = getCacheStats();
    logger.debug('Cache stats retrieved', stats);

    res.json({
      success: true,
      stats,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    logger.error('Error getting cache stats', { error: error.message });
    res.status(500).json({
      success: false,
      message: 'Failed to get cache stats',
      error: error.message,
    });
  }
};

/**
 * Health check endpoint
 */
exports.healthCheck = async (req, res) => {
  try {
    const healthData = await dashboardService.getHealthCheckData();
    const statusCode = healthData.healthy ? 200 : 503;

    res.status(statusCode).json(healthData);
  } catch (error) {
    logger.error('Health check failed', { error: error.message });
    res.status(503).json({
      healthy: false,
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
};
