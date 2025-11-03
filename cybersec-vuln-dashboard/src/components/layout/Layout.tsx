import { ReactNode } from 'react';
import { Box } from '@mui/material';
import { Header } from './Header';
import './Layout.css';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <Box className="layout">
      <Header />
      <Box className="layout__content">
        {children}
      </Box>
    </Box>
  );
};
