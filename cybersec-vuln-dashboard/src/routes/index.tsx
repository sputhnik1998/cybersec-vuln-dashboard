import { createBrowserRouter, Navigate } from 'react-router-dom';
import DashboardPage from '../views/dashboard/DashboardPage';
import CVEDetailPage from '../views/cve-detail/CVEDetailPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: '/dashboard',
    element: <DashboardPage />,
  },
  {
    path: '/dashboard/cve/:cveId',
    element: <CVEDetailPage />,
  },
]);
