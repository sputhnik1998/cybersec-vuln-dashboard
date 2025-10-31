import { Paper, Typography } from '@mui/material';
import './MetricCard.css';

interface MetricCardProps {
  title: string;
  value: string | number;
  color?: string;
  loading?: boolean;
}

export const MetricCard = ({ title, value, color, loading = false }: MetricCardProps) => {
  return (
    <Paper elevation={2} className="metric-card">
      <Typography variant="body2" color="text.secondary" className="metric-card__title">
        {title}
      </Typography>
      <Typography
        variant="h3"
        className="metric-card__value"
        sx={{ color: color || 'text.primary' }}
      >
        {loading ? '...' : value}
      </Typography>
    </Paper>
  );
};
