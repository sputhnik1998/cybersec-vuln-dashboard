const Vulnerability = require('../models/Vulnerability');

/**
 * Fetch all dashboard aggregate data in a single service call
 * This combines stats, risk factors, and timeline into one unified response
 *
 * @param {Object} options - Optional parameters
 * @param {number} options.timelineMonths - Number of months for timeline (default: 12)
 * @returns {Promise<Object>} Unified dashboard data
 */
exports.getDashboardAggregates = async (options = {}) => {
  const { timelineMonths = 12 } = options;

  try {
    // Calculate timeline start date
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - timelineMonths);

    // Execute all aggregations in parallel for maximum performance
    const [
      totalCount,
      severityStats,
      affectedRepos,
      fixedStats,
      riskFactors,
      timeline,
    ] = await Promise.all([
      // 1. Total vulnerabilities count
      Vulnerability.countDocuments(),

      // 2. Count by severity
      Vulnerability.aggregate([
        {
          $group: {
            _id: '$severity',
            count: { $sum: 1 },
          },
        },
      ]),

      // 3. Count affected repositories/packages
      Vulnerability.distinct('packageName'),

      // 4. Fixed vulnerabilities count
      Vulnerability.aggregate([
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            fixed: {
              $sum: {
                $cond: [
                  { $regexMatch: { input: '$status', regex: /fixed/i } },
                  1,
                  0,
                ],
              },
            },
          },
        },
      ]),

      // 5. Top 10 risk factors
      Vulnerability.aggregate([
        {
          $match: {
            riskFactors: { $exists: true, $ne: null },
          },
        },
        {
          $project: {
            riskFactorKeys: { $objectToArray: '$riskFactors' },
          },
        },
        {
          $unwind: '$riskFactorKeys',
        },
        {
          $group: {
            _id: '$riskFactorKeys.k',
            count: { $sum: 1 },
          },
        },
        {
          $sort: { count: -1 },
        },
        {
          $limit: 10,
        },
        {
          $project: {
            _id: 0,
            name: '$_id',
            count: 1,
          },
        },
      ]),

      // 6. Vulnerabilities timeline
      Vulnerability.aggregate([
        {
          $match: {
            published: { $gte: startDate },
          },
        },
        {
          $group: {
            _id: {
              year: { $year: '$published' },
              month: { $month: '$published' },
            },
            count: { $sum: 1 },
          },
        },
        {
          $sort: { '_id.year': 1, '_id.month': 1 },
        },
      ]),
    ]);

    // Format severity stats into a map
    const severityMap = severityStats.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {});

    // Calculate fix percentage
    const fixedPercentage = fixedStats.length > 0
      ? Math.round((fixedStats[0].fixed / fixedStats[0].total) * 100)
      : 0;

    // Build unified response object
    const dashboardData = {
      stats: {
        total: totalCount,
        affectedRepositories: affectedRepos.length,
        fixedPercentage,
        severityBreakdown: {
          critical: severityMap.critical || 0,
          high: severityMap.high || 0,
          medium: severityMap.medium || 0,
          low: severityMap.low || 0,
        },
      },
      riskFactors: riskFactors,
      timeline: timeline,
      metadata: {
        generatedAt: new Date().toISOString(),
        timelineMonths,
        queriesExecuted: 6,
      },
    };

    return dashboardData;
  } catch (error) {
    console.error('[Dashboard Service] Error fetching aggregates:', error);
    throw error;
  }
};

/**
 * Get basic health check data (lightweight, no heavy aggregations)
 * Useful for monitoring without hitting cache or doing expensive queries
 */
exports.getHealthCheckData = async () => {
  try {
    const totalCount = await Vulnerability.countDocuments();
    return {
      healthy: true,
      vulnerabilityCount: totalCount,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    return {
      healthy: false,
      error: error.message,
      timestamp: new Date().toISOString(),
    };
  }
};
