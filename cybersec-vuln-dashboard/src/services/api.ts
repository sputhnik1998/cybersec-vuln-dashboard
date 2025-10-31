import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface Vulnerability {
  _id: string;
  cve: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  cvss: number;
  status: string;
  cause?: string;
  description: string;
  vecStr?: string;
  exploit?: string;
  riskFactors?: Record<string, unknown>;
  link?: string;
  type?: string;
  packageName: string;
  packageVersion?: string;
  packageType?: string;
  layerTime?: Date;
  published?: Date;
  fixDate?: Date;
  applicableRules?: string[];
  owner?: string;
  advisoryType?: string;
  path?: string;
}

export interface VulnerabilitiesResponse {
  vulnerabilities: Vulnerability[];
  pagination: {
    currentPage: number;
    limit: number;
    hasMore: boolean;
    nextCursor: string | null;
    totalCount: number | null;
  };
}

export interface DashboardStats {
  total: number;
  affectedRepositories: number;
  fixedPercentage: number;
  severityBreakdown: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
}

export interface TimelineData {
  _id: {
    year: number;
    month: number;
  };
  count: number;
}

export interface RiskFactor {
  name: string;
  count: number;
}

// Get all vulnerabilities with filtering and pagination
export const getVulnerabilities = async (params?: {
  page?: number;
  limit?: number;
  severity?: string;
  status?: string;
  packageName?: string;
  cve?: string;
  sortBy?: string;
  order?: 'asc' | 'desc';
}): Promise<VulnerabilitiesResponse> => {
  const response = await api.get('/vulnerabilities', { params });
  return response.data;
};

// Get dashboard statistics
export const getDashboardStats = async (): Promise<DashboardStats> => {
  const response = await api.get('/vulnerabilities/stats');
  return response.data;
};

// Get vulnerabilities timeline
export const getVulnerabilitiesTimeline = async (
  months: number = 12
): Promise<TimelineData[]> => {
  const response = await api.get('/vulnerabilities/timeline', {
    params: { months },
  });
  return response.data;
};

// Get risk factors
export const getRiskFactors = async (): Promise<RiskFactor[]> => {
  const response = await api.get('/vulnerabilities/risk-factors');
  return response.data;
};

// Get single vulnerability by ID
export const getVulnerabilityById = async (id: string): Promise<Vulnerability> => {
  const response = await api.get(`/vulnerabilities/${id}`);
  return response.data;
};

export default api;
