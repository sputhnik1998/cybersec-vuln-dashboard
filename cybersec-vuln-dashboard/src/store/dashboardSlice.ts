import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import {
  getDashboardStats,
  getRiskFactors,
  getVulnerabilitiesTimeline,
  getDashboardAggregates,
} from '../services/api';
import type {
  DashboardStats,
  RiskFactor,
  TimelineData,
  DashboardAggregates,
} from '../services/api';

interface DashboardState {
  stats: DashboardStats | null;
  riskFactors: RiskFactor[];
  timeline: TimelineData[];
  cacheMetadata: {
    generatedAt: string | null;
    isCached: boolean;
    ttl: number | null;
  };
  loading: {
    stats: boolean;
    riskFactors: boolean;
    timeline: boolean;
    all: boolean;
  };
  error: {
    stats: string | null;
    riskFactors: string | null;
    timeline: string | null;
    all: string | null;
  };
}

const initialState: DashboardState = {
  stats: null,
  riskFactors: [],
  timeline: [],
  cacheMetadata: {
    generatedAt: null,
    isCached: false,
    ttl: null,
  },
  loading: {
    stats: false,
    riskFactors: false,
    timeline: false,
    all: false,
  },
  error: {
    stats: null,
    riskFactors: null,
    timeline: null,
    all: null,
  },
};

// Async thunks
export const fetchDashboardStats = createAsyncThunk(
  'dashboard/fetchStats',
  async () => {
    const response = await getDashboardStats();
    return response;
  }
);

export const fetchRiskFactors = createAsyncThunk(
  'dashboard/fetchRiskFactors',
  async () => {
    const response = await getRiskFactors();
    return response;
  }
);

export const fetchTimeline = createAsyncThunk(
  'dashboard/fetchTimeline',
  async (months: number = 12) => {
    const response = await getVulnerabilitiesTimeline(months);
    return response;
  }
);

// Thunk to fetch all dashboard data at once using unified endpoint (recommended)
export const fetchAllDashboardData = createAsyncThunk(
  'dashboard/fetchAllData',
  async (timelineMonths: number = 12) => {
    const response = await getDashboardAggregates(timelineMonths);
    return response;
  }
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    resetDashboard: (state) => {
      state.stats = null;
      state.riskFactors = [];
      state.timeline = [];
      state.error = {
        stats: null,
        riskFactors: null,
        timeline: null,
      };
    },
  },
  extraReducers: (builder) => {
    // Dashboard stats
    builder
      .addCase(fetchDashboardStats.pending, (state) => {
        state.loading.stats = true;
        state.error.stats = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action: PayloadAction<DashboardStats>) => {
        state.loading.stats = false;
        state.stats = action.payload;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.loading.stats = false;
        state.error.stats = action.error.message || 'Failed to fetch dashboard stats';
      });

    // Risk factors
    builder
      .addCase(fetchRiskFactors.pending, (state) => {
        state.loading.riskFactors = true;
        state.error.riskFactors = null;
      })
      .addCase(fetchRiskFactors.fulfilled, (state, action: PayloadAction<RiskFactor[]>) => {
        state.loading.riskFactors = false;
        state.riskFactors = action.payload;
      })
      .addCase(fetchRiskFactors.rejected, (state, action) => {
        state.loading.riskFactors = false;
        state.error.riskFactors = action.error.message || 'Failed to fetch risk factors';
      });

    // Timeline
    builder
      .addCase(fetchTimeline.pending, (state) => {
        state.loading.timeline = true;
        state.error.timeline = null;
      })
      .addCase(fetchTimeline.fulfilled, (state, action: PayloadAction<TimelineData[]>) => {
        state.loading.timeline = false;
        state.timeline = action.payload;
      })
      .addCase(fetchTimeline.rejected, (state, action) => {
        state.loading.timeline = false;
        state.error.timeline = action.error.message || 'Failed to fetch timeline';
      });

    // Unified dashboard data (single endpoint)
    builder
      .addCase(fetchAllDashboardData.pending, (state) => {
        state.loading.all = true;
        state.loading.stats = true;
        state.loading.riskFactors = true;
        state.loading.timeline = true;
        state.error.all = null;
      })
      .addCase(fetchAllDashboardData.fulfilled, (state, action: PayloadAction<DashboardAggregates>) => {
        state.loading.all = false;
        state.loading.stats = false;
        state.loading.riskFactors = false;
        state.loading.timeline = false;

        // Update all data from unified response
        state.stats = action.payload.stats;
        state.riskFactors = action.payload.riskFactors;
        state.timeline = action.payload.timeline;

        // Update cache metadata
        state.cacheMetadata = {
          generatedAt: action.payload.metadata.generatedAt,
          isCached: action.payload._cache?.hit || false,
          ttl: action.payload._cache?.ttl || null,
        };
      })
      .addCase(fetchAllDashboardData.rejected, (state, action) => {
        state.loading.all = false;
        state.loading.stats = false;
        state.loading.riskFactors = false;
        state.loading.timeline = false;
        state.error.all = action.error.message || 'Failed to fetch dashboard data';
      });
  },
});

export const { resetDashboard } = dashboardSlice.actions;
export default dashboardSlice.reducer;
