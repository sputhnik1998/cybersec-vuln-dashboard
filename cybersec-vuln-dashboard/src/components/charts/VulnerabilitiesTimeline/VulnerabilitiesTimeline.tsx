import { memo, useMemo } from 'react';
import {
  LineChart,
  Line,
  Area,
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

const VulnerabilitiesTimelineComponent = ({
  data,
  loading = false,
}: VulnerabilitiesTimelineProps) => {
  // Memoize chart data to prevent unnecessary re-renders
  const chartData = useMemo(() => {
    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
    ];
    return data.map((item) => ({
      month: `${monthNames[item._id.month - 1]} ${item._id.year}`,
      count: item.count,
    }));
  }, [data]);

  // Calculate Y-axis domain dynamically based on data
  const yAxisDomain = useMemo(() => {
    if (chartData.length === 0) return [0, 100];

    const counts = chartData.map(item => item.count);
    const minValue = Math.min(...counts);
    const maxValue = Math.max(...counts);

    // Add 10% padding to the range for better visualization
    const padding = (maxValue - minValue) * 0.1;
    const min = Math.max(0, Math.floor(minValue - padding));
    const max = Math.ceil(maxValue + padding);

    return [min, max];
  }, [chartData]);

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

  return (
    <Box className="vulnerabilities-timeline">
      <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={300} debounce={50}>
        <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
          <defs>
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.4} />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" opacity={0.3} />
          <XAxis
            dataKey="month"
            angle={-45}
            textAnchor="end"
            height={80}
            tick={{ fontSize: 11, fill: '#9ca3af' }}
            stroke="#4b5563"
          />
          <YAxis
            stroke="#4b5563"
            tick={{ fontSize: 12, fill: '#9ca3af' }}
            domain={yAxisDomain}
            allowDataOverflow={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Area
            type="monotone"
            dataKey="count"
            fill="url(#areaGradient)"
            stroke="none"
          />
          <Line
            type="monotone"
            dataKey="count"
            stroke="#3b82f6"
            strokeWidth={3}
            dot={{ r: 5, fill: '#60a5fa', stroke: '#3b82f6', strokeWidth: 2 }}
            activeDot={{ r: 7, fill: '#fff', stroke: '#3b82f6', strokeWidth: 2 }}
            name="Vulnerabilities"
            animationDuration={300}
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};

export const VulnerabilitiesTimeline = memo(
  VulnerabilitiesTimelineComponent,
  (prevProps, nextProps) => {
    // Re-render if loading state changes
    if (prevProps.loading !== nextProps.loading) return false;

    // Re-render if data array length changes
    if (prevProps.data.length !== nextProps.data.length) return false;

    // Re-render if any data item changed
    if (prevProps.data.length > 0 && nextProps.data.length > 0) {
      // Check if data content actually changed
      for (let i = 0; i < prevProps.data.length; i++) {
        const prev = prevProps.data[i];
        const next = nextProps.data[i];
        if (!prev || !next) return false;
        if (prev._id.month !== next._id.month ||
            prev._id.year !== next._id.year ||
            prev.count !== next.count) {
          return false;
        }
      }
    }

    // Props are equal, don't re-render
    return true;
  }
);
