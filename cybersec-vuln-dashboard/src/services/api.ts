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
  kaiStatus?: string;
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
    totalCount: number;
    totalPages: number;
    hasMore: boolean;
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

export interface DashboardAggregates {
  stats: DashboardStats;
  riskFactors: RiskFactor[];
  timeline: TimelineData[];
  metadata: {
    generatedAt: string;
    timelineMonths: number;
    queriesExecuted: number;
  };
  _cache?: {
    hit: boolean;
    key: string;
    ttl: number;
  };
}

// Get all vulnerabilities with filtering and pagination
export const getVulnerabilities = async (params?: {
  page?: number;
  limit?: number;
  severity?: string;
  status?: string;
  packageName?: string;
  cve?: string;
  kaiStatus?: string;
  sortBy?: string;
  order?: 'asc' | 'desc';
}): Promise<VulnerabilitiesResponse> => {
  // Filter out empty string values and undefined
  const cleanParams = params ? Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== '' && value !== undefined)
  ) : {};

  const response = await api.get('/vulnerabilities', { params: cleanParams });
  return response.data;
};

// Get single vulnerability by ID
export const getVulnerabilityById = async (id: string): Promise<Vulnerability> => {
  const response = await api.get(`/vulnerabilities/${id}`);
  return response.data;
};

// Get unified dashboard aggregates (cached, single endpoint)
export const getDashboardAggregates = async (
  timelineMonths: number = 12
): Promise<DashboardAggregates> => {
  const response = await api.get('/dashboard/aggregates', {
    params: { timelineMonths },
  });
  return response.data;
};

// Invalidate dashboard cache
export const invalidateDashboardCache = async (): Promise<{ success: boolean }> => {
  const response = await api.post('/dashboard/cache/invalidate');
  return response.data;
};

// Get cache statistics
export const getCacheStats = async (): Promise<any> => {
  const response = await api.get('/dashboard/cache/stats');
  return response.data;
};

export default api;
