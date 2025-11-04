import { useEffect, useMemo } from 'react';
import { Box, Paper, Typography, CircularProgress } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../store';
import { fetchAllDashboardData } from '../../store/dashboardSlice';
import { fetchVulnerabilities } from '../../store/vulnerabilitiesSlice';
import { Layout } from '../../components/layout';
import { MetricCard } from '../../components/cards/MetricCard';
import { SeverityCard } from '../../components/cards/SeverityCard';
import { SeverityRadialBarChart } from '../../components/charts/SeverityRadialBarChart';
import { RiskFactorsBarChart } from '../../components/charts/RiskFactorsBarChart';
import { VulnerabilitiesTimeline } from '../../components/charts/VulnerabilitiesTimeline';
import { VulnerabilityTable } from '../../components/tables/VulnerabilityTable';
import { CriticalAlert } from '../../components/alerts/CriticalAlert';
import { formatSeverityData } from '../../utils/severityConfig';
import './DashboardPage.css';

const DashboardPage = () => {
  const dispatch = useAppDispatch();
  const scrollPosition = useAppSelector((state) => state.vulnerabilities.scrollPosition);

  // Get data from Redux store
  const { stats, riskFactors, timeline, loading: dashboardLoading } = useAppSelector((state) => state.dashboard);

  // Get vulnerabilities data
  const { items: vulnerabilities, pagination, loading: vulnerabilitiesLoading, currentPage, rowsPerPage, sortBy, sortOrder } = useAppSelector(
    (state) => state.vulnerabilities
  );

  // Fetch dashboard data only if Redux store is empty
  useEffect(() => {
    const hasDashboardData = stats && riskFactors.length > 0 && timeline.length > 0;
    const hasVulnerabilitiesData = vulnerabilities.length > 0 && pagination;

    if (!hasDashboardData) {
      dispatch(fetchAllDashboardData());
    }

    if (!hasVulnerabilitiesData) {
      dispatch(fetchVulnerabilities({
        page: currentPage,
        limit: rowsPerPage,
        sortBy,
        order: sortOrder,
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Restore scroll position when returning from CVE detail
  useEffect(() => {
    if (scrollPosition > 0) {
      window.scrollTo(0, scrollPosition);
    }
  }, [scrollPosition]);

  // Prevent default behavior on chart cards to avoid highlighting
  const handleChartMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  // Format severity data once stats are available
  const severityData = stats ? formatSeverityData(stats.severityBreakdown) : [];

  // Calculate timeline data from current page vulnerabilities
  const currentPageTimeline = useMemo(() => {
    if (!vulnerabilities || vulnerabilities.length === 0) return [];

    // Group vulnerabilities by month and year
    const timelineMap = new Map<string, { _id: { month: number; year: number }; count: number }>();

    vulnerabilities.forEach((vuln) => {
      const date = vuln.published ? new Date(vuln.published) : null;
      if (date && !isNaN(date.getTime())) {
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        const key = `${year}-${month}`;

        const existing = timelineMap.get(key);
        if (existing) {
          existing.count++;
        } else {
          timelineMap.set(key, {
            _id: { month, year },
            count: 1,
          });
        }
      }
    });

    // Convert map to array and sort by date
    return Array.from(timelineMap.values()).sort((a, b) => {
      if (a._id.year !== b._id.year) return a._id.year - b._id.year;
      return a._id.month - b._id.month;
    });
  }, [vulnerabilities]);

  // Generate unique key for timeline chart to force re-render on data changes
  const timelineKey = useMemo(() => {
    if (currentPageTimeline.length === 0) return 'empty';
    return currentPageTimeline.map(t => `${t._id.month}-${t._id.year}-${t.count}`).join('_');
  }, [currentPageTimeline]);

  // Check if this is initial load (no data in Redux at all)
  const isInitialLoad = !stats && !pagination;

  // Show loading state while fetching data
  const isLoading = (dashboardLoading.stats || dashboardLoading.riskFactors || vulnerabilitiesLoading) || isInitialLoad;

  // Show loading state while any data is being fetched
  if (isLoading && !stats) {
    return (
      <Layout>
        <Box className="dashboard-page">
          <Box className="dashboard-page__loading">
            <CircularProgress size={60} />
            <Typography variant="body1" sx={{ mt: 2, color: 'var(--color-text-secondary)' }}>
              Loading dashboard data...
            </Typography>
          </Box>
        </Box>
      </Layout>
    );
  }

  // If we have no data after loading is complete, show error
  if ((!stats || !pagination) && !dashboardLoading.stats && !dashboardLoading.riskFactors && !vulnerabilitiesLoading) {
    return (
      <Layout>
        <Box className="dashboard-page">
          <Box className="dashboard-page__loading">
            <Typography variant="body1" sx={{ color: 'var(--color-text-secondary)' }}>
              Unable to load dashboard data. Please refresh the page.
            </Typography>
          </Box>
        </Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Box className="dashboard-page">
        {/* Critical Alert - Shows when critical vulnerabilities > 5 */}
        <CriticalAlert criticalCount={stats.severityBreakdown.critical} />

        {/* First Row - 4 Metric Cards */}
      <Box className="dashboard-page__metrics-grid">
        <MetricCard
          title="Total"
          value={stats.total.toLocaleString()}
        />
        <MetricCard
          title="Affected Repositories"
          value={stats.affectedRepositories.toLocaleString()}
        />
        <MetricCard
          title="Fixed"
          value={`${stats.fixedPercentage}%`}
        />
        <SeverityCard severities={severityData} />
      </Box>

      {/* Second Row - 2 Larger Cards */}
      <Box className="dashboard-page__charts-grid">
        <Paper elevation={2} className="dashboard-page__chart-card" tabIndex={-1} onMouseDown={handleChartMouseDown} sx={{ backgroundColor: '#1a1a1a' }}>
          <Typography variant="h6" className="dashboard-page__chart-title">
            Vulnerability Severity Distribution
          </Typography>
          <SeverityRadialBarChart data={severityData} loading={dashboardLoading.stats} />
        </Paper>
        <Paper elevation={2} className="dashboard-page__chart-card" tabIndex={-1} onMouseDown={handleChartMouseDown} sx={{ backgroundColor: '#1a1a1a' }}>
          <Typography variant="h6" className="dashboard-page__chart-title">
            Top Risk Factors
          </Typography>
          <RiskFactorsBarChart data={riskFactors} loading={dashboardLoading.riskFactors} />
        </Paper>
      </Box>

      {/* Third Row - Timeline Chart */}
      <Paper elevation={2} className="dashboard-page__chart-card" tabIndex={-1} onMouseDown={handleChartMouseDown} sx={{ backgroundColor: '#1a1a1a', marginBottom: 'var(--spacing-md)' }}>
        <Typography variant="h6" className="dashboard-page__chart-title">
          Vulnerabilities Over Time (Current Page)
        </Typography>
        <VulnerabilitiesTimeline key={timelineKey} data={currentPageTimeline} loading={vulnerabilitiesLoading} />
      </Paper>

      {/* Fourth Row - Vulnerability Table */}
      <VulnerabilityTable />
      </Box>
    </Layout>
  );
};

export default DashboardPage;
