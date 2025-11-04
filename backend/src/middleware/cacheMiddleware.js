const NodeCache = require('node-cache');

// Initialize cache with 30 minute TTL (1800 seconds)
const cache = new NodeCache({
  stdTTL: 1800,
  checkperiod: 600, // Check for expired keys every 10 minutes
  useClones: false, // Better performance, but be careful with mutable objects
  deleteOnExpire: true,
});

// Cache statistics
let cacheStats = {
  hits: 0,
  misses: 0,
  lastReset: Date.now(),
};

/**
 * Middleware to cache GET requests
 * @param {string} keyPrefix - Prefix for the cache key
 * @param {number} ttl - Time to live in seconds (optional, defaults to cache stdTTL)
 */
const cacheMiddleware = (keyPrefix, ttl = null) => {
  return (req, res, next) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    // Generate cache key from prefix and query params
    const queryString = JSON.stringify(req.query);
    const cacheKey = `${keyPrefix}:${queryString}`;

    try {
      // Try to get cached data
      const cachedData = cache.get(cacheKey);

      if (cachedData !== undefined) {
        cacheStats.hits++;
        console.log(`[Cache HIT] ${cacheKey}`);

        // Add cache metadata to response
        return res.json({
          ...cachedData,
          _cache: {
            hit: true,
            key: cacheKey,
            ttl: cache.getTtl(cacheKey),
          },
        });
      }

      // Cache miss - continue to controller
      cacheStats.misses++;
      console.log(`[Cache MISS] ${cacheKey}`);

      // Store original res.json function
      const originalJson = res.json.bind(res);

      // Override res.json to cache the response
      res.json = (data) => {
        try {
          // Cache the response data
          const ttlToUse = ttl || cache.options.stdTTL;
          cache.set(cacheKey, data, ttlToUse);
          console.log(`[Cache SET] ${cacheKey} with TTL ${ttlToUse}s`);

          // Add cache metadata
          data._cache = {
            hit: false,
            key: cacheKey,
            ttl: Date.now() + ttlToUse * 1000,
          };
        } catch (err) {
          console.error('[Cache ERROR] Failed to cache response:', err.message);
        }

        // Call original json function
        return originalJson(data);
      };

      next();
    } catch (err) {
      console.error('[Cache ERROR] Middleware error:', err.message);
      next(); // Continue without caching on error
    }
  };
};

/**
 * Invalidate cache by key or pattern
 * @param {string} keyOrPattern - Cache key or pattern (supports wildcards)
 */
const invalidateCache = (keyOrPattern) => {
  try {
    if (keyOrPattern.includes('*')) {
      // Pattern-based invalidation
      const keys = cache.keys();
      const pattern = new RegExp(keyOrPattern.replace('*', '.*'));
      const matchedKeys = keys.filter((key) => pattern.test(key));

      matchedKeys.forEach((key) => cache.del(key));
      console.log(`[Cache INVALIDATE] Removed ${matchedKeys.length} keys matching ${keyOrPattern}`);

      return matchedKeys.length;
    } else {
      // Single key invalidation
      const deleted = cache.del(keyOrPattern);
      console.log(`[Cache INVALIDATE] ${keyOrPattern} - ${deleted ? 'Success' : 'Not found'}`);

      return deleted ? 1 : 0;
    }
  } catch (err) {
    console.error('[Cache ERROR] Invalidation failed:', err.message);
    return 0;
  }
};

/**
 * Clear all cache
 */
const clearCache = () => {
  try {
    cache.flushAll();
    cacheStats = {
      hits: 0,
      misses: 0,
      lastReset: Date.now(),
    };
    console.log('[Cache CLEAR] All cache cleared');
    return true;
  } catch (err) {
    console.error('[Cache ERROR] Clear failed:', err.message);
    return false;
  }
};

/**
 * Get cache statistics
 */
const getCacheStats = () => {
  const stats = cache.getStats();
  const hitRate = cacheStats.hits + cacheStats.misses > 0
    ? (cacheStats.hits / (cacheStats.hits + cacheStats.misses) * 100).toFixed(2)
    : 0;

  return {
    hits: cacheStats.hits,
    misses: cacheStats.misses,
    hitRate: `${hitRate}%`,
    keys: stats.keys,
    ksize: stats.ksize,
    vsize: stats.vsize,
    lastReset: new Date(cacheStats.lastReset).toISOString(),
  };
};

/**
 * Warm cache with initial data (optional)
 */
const warmCache = async (key, dataFetcher, ttl = null) => {
  try {
    console.log(`[Cache WARM] Starting for ${key}...`);
    const data = await dataFetcher();
    const ttlToUse = ttl || cache.options.stdTTL;
    cache.set(key, data, ttlToUse);
    console.log(`[Cache WARM] Success for ${key}`);
    return true;
  } catch (err) {
    console.error(`[Cache WARM] Failed for ${key}:`, err.message);
    return false;
  }
};

module.exports = {
  cache,
  cacheMiddleware,
  invalidateCache,
  clearCache,
  getCacheStats,
  warmCache,
};
