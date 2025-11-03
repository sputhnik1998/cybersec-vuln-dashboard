import { AppBar, Toolbar, Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import './Header.css';

export const Header = () => {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate('/dashboard');
  };

  return (
    <AppBar position="static" className="header" elevation={2}>
      <Toolbar className="header__toolbar">
        <Box className="header__logo-container" onClick={handleLogoClick}>
          <img
            src="/logo.webp"
            alt="Company Logo"
            className="header__logo"
          />
          <Typography variant="h3" className="header__title">
            Vulnerability Dashboard
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
