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

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
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
};

export const RiskFactorsBarChart = ({ data, loading = false }: RiskFactorsBarChartProps) => {
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
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 10, right: 10, left: 0, bottom: 40 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis
            dataKey="name"
            angle={-45}
            textAnchor="end"
            height={80}
            tick={{ fontSize: 11 }}
            stroke="#666"
          />
          <YAxis stroke="#666" tick={{ fontSize: 12 }} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }} />
          <Bar
            dataKey="count"
            fill="#1e3a8a"
            radius={[8, 8, 0, 0]}
            maxBarSize={60}
          />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
};
