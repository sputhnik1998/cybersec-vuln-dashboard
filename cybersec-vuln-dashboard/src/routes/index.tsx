import { createBrowserRouter } from 'react-router-dom';
import DashboardPage from '../views/dashboard/DashboardPage';
import CVEDetailPage from '../views/cve-detail/CVEDetailPage';

export const router = createBrowserRouter([
  {
    path: '/dashboard',
    element: <DashboardPage />,
  },
  {
    path: '/dashboard/cve/:cveId',
    element: <CVEDetailPage />,
  },
]);
