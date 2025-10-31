import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Box, Typography } from '@mui/material';
import type { TimelineData } from '../../../services/api';
import './VulnerabilitiesTimeline.css';

interface VulnerabilitiesTimelineProps {
  data: TimelineData[];
  loading?: boolean;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    payload: { month: string; count: number };
  }>;
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <Box className="vulnerabilities-timeline__tooltip">
        <Typography variant="body2" fontWeight={600}>
          {data.month}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Vulnerabilities: {data.count.toLocaleString()}
        </Typography>
      </Box>
    );
  }
  return null;
};

export const VulnerabilitiesTimeline = ({
  data,
  loading = false,
}: VulnerabilitiesTimelineProps) => {
  if (loading) {
    return (
      <Box className="vulnerabilities-timeline__loading">
        <Typography color="text.secondary">Loading chart...</Typography>
      </Box>
    );
  }

  if (data.length === 0) {
    return (
      <Box className="vulnerabilities-timeline__empty">
        <Typography color="text.secondary">No timeline data available</Typography>
      </Box>
    );
  }

  // Format data for the chart
  const chartData = data.map((item) => {
    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
    ];
    return {
      month: `${monthNames[item._id.month - 1]} ${item._id.year}`,
      count: item.count,
    };
  });

  return (
    <Box className="vulnerabilities-timeline">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis
            dataKey="month"
            angle={-45}
            textAnchor="end"
            height={80}
            tick={{ fontSize: 11 }}
            stroke="#666"
          />
          <YAxis stroke="#666" tick={{ fontSize: 12 }} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line
            type="monotone"
            dataKey="count"
            stroke="#1e3a8a"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
            name="Vulnerabilities"
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};
