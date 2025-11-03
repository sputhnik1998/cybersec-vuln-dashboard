import { useState } from 'react';
import { Box, Paper, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import WarningIcon from '@mui/icons-material/Warning';
import './CriticalAlert.css';

interface CriticalAlertProps {
  criticalCount: number;
}

export const CriticalAlert = ({ criticalCount }: CriticalAlertProps) => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible || criticalCount <= 5) {
    return null;
  }

  return (
    <Paper elevation={3} className="critical-alert">
      <Box className="critical-alert__content">
        <WarningIcon className="critical-alert__icon" />
        <Box className="critical-alert__text">
          <Typography variant="h6" className="critical-alert__title">
            Critical Vulnerabilities Alert
          </Typography>
          <Typography variant="body2" className="critical-alert__message">
            You have {criticalCount} critical severity CVEs. Please look into these critical vulnerabilities immediately.
          </Typography>
        </Box>
        <IconButton
          className="critical-alert__close-button"
          onClick={() => setIsVisible(false)}
          aria-label="close alert"
          size="small"
        >
          <CloseIcon />
        </IconButton>
      </Box>
    </Paper>
  );
};
