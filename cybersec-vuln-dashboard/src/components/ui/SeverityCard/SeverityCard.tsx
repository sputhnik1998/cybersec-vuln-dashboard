import { Box, Paper, Typography } from '@mui/material';
import type { SeverityData } from '../../../types/vulnerability';
import './SeverityCard.css';

interface SeverityCardProps {
  severities: SeverityData[];
  loading?: boolean;
}

export const SeverityCard = ({ severities, loading = false }: SeverityCardProps) => {
  return (
    <Paper elevation={2} className="severity-card">
      <Box className="severity-card__grid">
        {severities.map((severity) => (
          <Box key={severity.label} className="severity-card__item">
            <Box
              className="severity-card__indicator"
              sx={{ backgroundColor: severity.color }}
            />
            <Typography variant="h5" className="severity-card__count">
              {loading ? '...' : severity.count.toLocaleString()}
            </Typography>
          </Box>
        ))}
      </Box>
    </Paper>
  );
};
