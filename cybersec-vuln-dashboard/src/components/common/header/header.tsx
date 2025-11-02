import { useEffect } from 'react';
import { Box, Paper, Typography, Skeleton } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../../store';
import { fetchAllDashboardData } from '../../../store/dashboardSlice';
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
  const { stats, riskFactors, timeline } = useAppSelector((state) => ({
    stats: state.dashboard.stats,
    riskFactors: state.dashboard.riskFactors,
    timeline: state.dashboard.timeline,
    loading: state.dashboard.loading,
    error: state.dashboard.error,
  }));

  // Fetch all dashboard data simultaneously on mount
  useEffect(() => {
    dispatch(fetchAllDashboardData());
    // VulnerabilityTable component handles its own data fetching
  }, [dispatch]);

  // Format severity data once stats are available
  const severityData = stats ? formatSeverityData(stats.severityBreakdown) : [];

  return (
    <Box className="header">
      <Typography variant="h4" className="header__title">
        Vulnerability Dashboard
      </Typography>

      {/* First Row - 4 Metric Cards */}
      <Box className="header__metrics-grid">
        {stats ? (
          <>
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
          </>
        ) : (
          <>
            <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 2 }} />
            <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 2 }} />
            <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 2 }} />
            <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 2 }} />
          </>
        )}
      </Box>

      {/* Second Row - 2 Larger Cards */}
      <Box className="header__charts-grid">
        <Paper elevation={2} className="header__chart-card" tabIndex={-1}>
          <Typography variant="h6" className="header__chart-title">
            Vulnerability Severity Distribution
          </Typography>
          <SeverityRadialBarChart data={severityData} loading={!stats} />
        </Paper>
        <Paper elevation={2} className="header__chart-card" tabIndex={-1}>
          <Typography variant="h6" className="header__chart-title">
            Top Risk Factors
          </Typography>
          <RiskFactorsBarChart data={riskFactors} loading={riskFactors.length === 0} />
        </Paper>
      </Box>

      {/* Third Row - Timeline Chart */}
      <Box sx={{ marginTop: 2 }}>
        <Paper elevation={2} className="header__chart-card" tabIndex={-1}>
          <Typography variant="h6" className="header__chart-title">
            Vulnerabilities Over Time
          </Typography>
          <VulnerabilitiesTimeline data={timeline} loading={timeline.length === 0} />
        </Paper>
      </Box>

      {/* Fourth Row - Vulnerability Table */}
      <VulnerabilityTable />
    </Box>
  );
};

export default Header;
