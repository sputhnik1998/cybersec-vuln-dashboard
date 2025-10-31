import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import {
  getDashboardStats,
  getRiskFactors,
  getVulnerabilitiesTimeline,
} from '../services/api';
import type {
  DashboardStats,
  RiskFactor,
  TimelineData,
} from '../services/api';

interface DashboardState {
  stats: DashboardStats | null;
  riskFactors: RiskFactor[];
  timeline: TimelineData[];
  loading: {
    stats: boolean;
    riskFactors: boolean;
    timeline: boolean;
  };
  error: {
    stats: string | null;
    riskFactors: string | null;
    timeline: string | null;
  };
}

const initialState: DashboardState = {
  stats: null,
  riskFactors: [],
  timeline: [],
  loading: {
    stats: false,
    riskFactors: false,
    timeline: false,
  },
  error: {
    stats: null,
    riskFactors: null,
    timeline: null,
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

// Thunk to fetch all dashboard data at once
export const fetchAllDashboardData = createAsyncThunk(
  'dashboard/fetchAllData',
  async (_, { dispatch }) => {
    await Promise.all([
      dispatch(fetchDashboardStats()),
      dispatch(fetchRiskFactors()),
      dispatch(fetchTimeline(12)),
    ]);
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
  },
});

export const { resetDashboard } = dashboardSlice.actions;
export default dashboardSlice.reducer;
