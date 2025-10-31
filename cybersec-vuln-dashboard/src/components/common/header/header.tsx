import { useEffect } from 'react';
import { Box, Paper, Typography, CircularProgress } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../../store';
import { fetchAllDashboardData } from '../../../store/dashboardSlice';
import { fetchVulnerabilities } from '../../../store/vulnerabilitiesSlice';
import { MetricCard } from '../../ui/MetricCard';
import { SeverityCard } from '../../ui/SeverityCard';
import { SeverityRadialBarChart } from '../../ui/SeverityRadialBarChart';
import { RiskFactorsBarChart } from '../../ui/RiskFactorsBarChart';
import { VulnerabilitiesTimeline } from '../../ui/VulnerabilitiesTimeline';
import { VulnerabilityTable } from '../../ui/VulnerabilityTable';
import { formatSeverityData } from '../../../utils/severityConfig';
import './Header.css';

const Header = () => {
  const dispatch = useAppDispatch();

  // Get data from Redux store
  const { stats, riskFactors, timeline, loading, error } = useAppSelector((state) => ({
    stats: state.dashboard.stats,
    riskFactors: state.dashboard.riskFactors,
    timeline: state.dashboard.timeline,
    loading: state.dashboard.loading,
    error: state.dashboard.error,
  }));

  const { items: vulnerabilities, loading: vulnLoading } = useAppSelector(
    (state) => state.vulnerabilities
  );

  // Fetch all dashboard data simultaneously on mount
  useEffect(() => {
    dispatch(fetchAllDashboardData());
    dispatch(fetchVulnerabilities({ page: 1, limit: 10 }));
  }, [dispatch]);

  // Check if ALL data is loading (initial load)
  const isInitialLoading =
    (loading.stats || loading.riskFactors || loading.timeline || vulnLoading) &&
    (!stats || riskFactors.length === 0 || timeline.length === 0 || vulnerabilities.length === 0);

  // Show loading spinner until ALL data is ready
  if (isInitialLoading) {
    return (
      <Box className="header">
        <Typography variant="h4" className="header__title">
          Vulnerability Dashboard
        </Typography>
        <Box className="header__loading">
          <CircularProgress />
          <Typography variant="body2" sx={{ ml: 2, color: 'text.secondary' }}>
            Loading dashboard data...
          </Typography>
        </Box>
      </Box>
    );
  }

  // Show error if stats failed to load
  if (error.stats) {
    return (
      <Box className="header">
        <Typography variant="h4" className="header__title">
          Vulnerability Dashboard
        </Typography>
        <Paper className="header__error">
          <Typography variant="body1">
            Error loading dashboard data: {error.stats}
          </Typography>
        </Paper>
      </Box>
    );
  }

  if (!stats) {
    return null;
  }

  const severityData = formatSeverityData(stats.severityBreakdown);

  return (
    <Box className="header">
      <Typography variant="h4" className="header__title">
        Vulnerability Dashboard
      </Typography>

      {/* First Row - 4 Metric Cards */}
      <Box className="header__metrics-grid">
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
      <Box className="header__charts-grid">
        <Paper elevation={2} className="header__chart-card">
          <Typography variant="h6" className="header__chart-title">
            Vulnerability Severity Distribution
          </Typography>
          <SeverityRadialBarChart data={severityData} loading={false} />
        </Paper>
        <Paper elevation={2} className="header__chart-card">
          <Typography variant="h6" className="header__chart-title">
            Top Risk Factors
          </Typography>
          <RiskFactorsBarChart data={riskFactors} loading={false} />
        </Paper>
      </Box>

      {/* Third Row - Timeline Chart */}
      <Box sx={{ marginTop: 2 }}>
        <Paper elevation={2} className="header__chart-card">
          <Typography variant="h6" className="header__chart-title">
            Vulnerabilities Over Time
          </Typography>
          <VulnerabilitiesTimeline data={timeline} loading={false} />
        </Paper>
      </Box>

      {/* Fourth Row - Vulnerability Table */}
      <VulnerabilityTable initialLimit={10} />
    </Box>
  );
};

export default Header;
