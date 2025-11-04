const dashboardService = require('../services/dashboardService');
const { invalidateCache, clearCache, getCacheStats } = require('../middleware/cacheMiddleware');

/**
 * Get unified dashboard aggregates
 * This endpoint returns all dashboard card data in a single response
 * Cached for 30 minutes by default
 *
 * @route GET /api/dashboard/aggregates
 */
exports.getAggregates = async (req, res) => {
  try {
    const { timelineMonths } = req.query;

    const options = {
      timelineMonths: timelineMonths ? parseInt(timelineMonths) : 12,
    };

    // Fetch unified dashboard data
    const dashboardData = await dashboardService.getDashboardAggregates(options);

    res.json(dashboardData);
  } catch (error) {
    console.error('[Dashboard Controller] Error in getAggregates:', error);
    res.status(500).json({
      message: 'Failed to fetch dashboard aggregates',
      error: error.message,
    });
  }
};

/**
 * Invalidate dashboard cache
 * Useful for forcing a refresh of cached data
 *
 * @route POST /api/dashboard/cache/invalidate
 */
exports.invalidateCache = async (req, res) => {
  try {
    const { pattern = 'dashboard:*' } = req.body;

    const deletedCount = invalidateCache(pattern);

    res.json({
      success: true,
      message: `Cache invalidated for pattern: ${pattern}`,
      deletedKeys: deletedCount,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[Dashboard Controller] Error invalidating cache:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to invalidate cache',
      error: error.message,
    });
  }
};

/**
 * Clear all cache
 * Nuclear option - clears entire cache
 *
 * @route POST /api/dashboard/cache/clear
 */
exports.clearAllCache = async (req, res) => {
  try {
    const success = clearCache();

    res.json({
      success,
      message: success ? 'All cache cleared successfully' : 'Failed to clear cache',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[Dashboard Controller] Error clearing cache:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to clear cache',
      error: error.message,
    });
  }
};

/**
 * Get cache statistics
 * Monitor cache performance and hit rates
 *
 * @route GET /api/dashboard/cache/stats
 */
exports.getCacheStats = async (req, res) => {
  try {
    const stats = getCacheStats();

    res.json({
      success: true,
      stats,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[Dashboard Controller] Error getting cache stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get cache stats',
      error: error.message,
    });
  }
};

/**
 * Health check endpoint
 * Lightweight check without hitting cache or expensive queries
 *
 * @route GET /api/dashboard/health
 */
exports.healthCheck = async (req, res) => {
  try {
    const healthData = await dashboardService.getHealthCheckData();

    const statusCode = healthData.healthy ? 200 : 503;
    res.status(statusCode).json(healthData);
  } catch (error) {
    console.error('[Dashboard Controller] Error in health check:', error);
    res.status(503).json({
      healthy: false,
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
};
