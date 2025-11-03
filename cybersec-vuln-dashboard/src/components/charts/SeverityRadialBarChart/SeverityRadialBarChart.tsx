import { memo, useMemo } from 'react';
import {
  RadialBarChart,
  RadialBar,
  Legend,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { Box, Typography } from '@mui/material';
import type { SeverityData } from '../../../types/vulnerability';
import './SeverityRadialBarChart.css';

interface SeverityRadialBarChartProps {
  data: SeverityData[];
  loading?: boolean;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: {
      name: string;
      value: number;
      fill: string;
    };
  }>;
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <Box className="severity-radial-bar-chart__tooltip">
        <Typography variant="body2" fontWeight={600} sx={{ textTransform: 'capitalize' }}>
          {data.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Count: {data.value?.toLocaleString()}
        </Typography>
      </Box>
    );
  }
  return null;
};

const SeverityRadialBarChartComponent = ({
  data,
  loading = false,
}: SeverityRadialBarChartProps) => {
  // Memoize chart data to prevent unnecessary re-renders
  const chartData = useMemo(() => {
    return data.map((item) => ({
      name: item.label,
      value: item.count,
      fill: item.color,
    }));
  }, [data]);

  if (loading) {
    return (
      <Box className="severity-radial-bar-chart__loading">
        <Typography color="text.secondary">Loading chart...</Typography>
      </Box>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Box className="severity-radial-bar-chart__empty">
        <Typography color="text.secondary">No severity data available</Typography>
      </Box>
    );
  }

  return (
    <Box className="severity-radial-bar-chart" sx={{ width: '100%', height: '270px' }}>
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart
          cx="50%"
          cy="50%"
          innerRadius="20%"
          outerRadius="90%"
          barSize={20}
          data={chartData}
          startAngle={90}
          endAngle={-180}
        >
          <RadialBar
            background={{ fill: '#1a1f3a' }}
            dataKey="value"
            cornerRadius={8}
          />
          <Legend
            iconSize={10}
            width={120}
            height={140}
            layout="vertical"
            verticalAlign="middle"
            align="right"
            wrapperStyle={{
              fontSize: '12px',
              paddingLeft: '10px',
              color: '#94a3b8',
            }}
            formatter={(value) => (
              <span style={{ color: '#94a3b8', textTransform: 'capitalize' }}>{value}</span>
            )}
          />
          <Tooltip content={<CustomTooltip />} />
        </RadialBarChart>
      </ResponsiveContainer>
    </Box>
  );
};

export const SeverityRadialBarChart = memo(SeverityRadialBarChartComponent);
