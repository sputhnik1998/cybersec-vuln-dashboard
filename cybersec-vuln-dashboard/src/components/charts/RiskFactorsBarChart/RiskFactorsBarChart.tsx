import { memo, useMemo, useCallback } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Box, Typography } from '@mui/material';
import type { RiskFactor } from '../../../services/api';
import './RiskFactorsBarChart.css';

interface RiskFactorsBarChartProps {
  data: RiskFactor[];
  loading?: boolean;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    payload: RiskFactor;
  }>;
}

const CustomTooltip = memo(({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <Box className="risk-factors-bar-chart__tooltip">
        <Typography variant="body2" fontWeight={600}>
          {data.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Vulnerabilities: {data.count.toLocaleString()}
        </Typography>
      </Box>
    );
  }
  return null;
});

CustomTooltip.displayName = 'CustomTooltip';

const RiskFactorsBarChartComponent = ({ data, loading = false }: RiskFactorsBarChartProps) => {
  // Memoize chart data to prevent unnecessary re-renders
  const chartData = useMemo(() => {
    return data.map((item) => ({
      name: item.name,
      count: item.count,
    }));
  }, [data]);

  // Memoize tooltip component
  const tooltipContent = useCallback(() => <CustomTooltip />, []);

  if (loading) {
    return (
      <Box className="risk-factors-bar-chart__loading">
        <Typography color="text.secondary">Loading chart...</Typography>
      </Box>
    );
  }

  if (data.length === 0) {
    return (
      <Box className="risk-factors-bar-chart__empty">
        <Typography color="text.secondary">No risk factors data available</Typography>
      </Box>
    );
  }

  return (
    <Box className="risk-factors-bar-chart">
      <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={200} debounce={50}>
        <BarChart
          data={chartData}
          margin={{ top: 10, right: 10, left: 0, bottom: 40 }}
        >
          <defs>
            <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#60a5fa" stopOpacity={1} />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.8} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" opacity={0.3} />
          <XAxis
            dataKey="name"
            angle={-45}
            textAnchor="end"
            height={80}
            tick={{ fontSize: 11, fill: '#9ca3af' }}
            stroke="#4b5563"
          />
          <YAxis stroke="#4b5563" tick={{ fontSize: 12, fill: '#9ca3af' }} />
          <Tooltip content={tooltipContent()} cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }} />
          <Bar
            dataKey="count"
            fill="url(#blueGradient)"
            radius={[8, 8, 0, 0]}
            maxBarSize={60}
          />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
};

export const RiskFactorsBarChart = memo(RiskFactorsBarChartComponent);
