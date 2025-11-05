import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';
import { Home, ArrowBack } from '@mui/icons-material';
import { Layout } from '../../components/layout';
import './NotFoundPage.css';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <Box className="not-found">
        <Box className="not-found__content">
          <Typography variant="h1" className="not-found__error-code">
            404
          </Typography>
          <Typography variant="h4" className="not-found__title">
            Oops! Page Not Found
          </Typography>
          <Typography variant="body1" className="not-found__description">
            The page you are looking for doesn't exist.
          </Typography>
          <Box className="not-found__actions">
            <Button
              variant="contained"
              size="large"
              startIcon={<Home />}
              onClick={() => navigate('/dashboard')}
              className="not-found__button not-found__button--primary"
            >
              Go to Dashboard
            </Button>
            <Button
              variant="outlined"
              size="large"
              startIcon={<ArrowBack />}
              onClick={() => navigate(-1)}
              className="not-found__button not-found__button--secondary"
            >
              Go Back
            </Button>
          </Box>
        </Box>
      </Box>
    </Layout>
  );
};

export default NotFoundPage;