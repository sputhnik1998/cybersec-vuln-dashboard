import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { getVulnerabilities } from '../services/api';
import type { Vulnerability, VulnerabilitiesResponse } from '../services/api';

interface PaginationInfo {
  currentPage: number;
  limit: number;
  totalCount: number;
  totalPages: number;
  hasMore: boolean;
}

interface VulnerabilitiesState {
  items: Vulnerability[];
  pagination: PaginationInfo | null;
  loading: boolean;
  error: string | null;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  currentPage: number;
  rowsPerPage: number;
  scrollPosition: number;
  filters: {
    severity: string;
    status: string;
    packageName: string;
    cve: string;
  };
}

const initialState: VulnerabilitiesState = {
  items: [],
  pagination: null,
  loading: false,
  error: null,
  sortBy: 'severity',
  sortOrder: 'asc',
  currentPage: 1,
  rowsPerPage: 25,
  scrollPosition: 0,
  filters: {
    severity: '',
    status: '',
    packageName: '',
    cve: '',
  },
};

interface FetchVulnerabilitiesParams {
  page?: number;
  limit?: number;
  severity?: string;
  status?: string;
  packageName?: string;
  cve?: string;
  sortBy?: string;
  order?: 'asc' | 'desc';
}

// Async thunk for fetching vulnerabilities
export const fetchVulnerabilities = createAsyncThunk(
  'vulnerabilities/fetch',
  async (params: FetchVulnerabilitiesParams = {}) => {
    const response = await getVulnerabilities(params);
    return response;
  }
);

const vulnerabilitiesSlice = createSlice({
  name: 'vulnerabilities',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<VulnerabilitiesState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        severity: '',
        status: '',
        packageName: '',
        cve: '',
      };
    },
    resetVulnerabilities: (state) => {
      state.items = [];
      state.pagination = null;
      state.error = null;
    },
    setSorting: (state, action: PayloadAction<{ sortBy: string; sortOrder: 'asc' | 'desc' }>) => {
      state.sortBy = action.payload.sortBy;
      state.sortOrder = action.payload.sortOrder;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setRowsPerPage: (state, action: PayloadAction<number>) => {
      state.rowsPerPage = action.payload;
      state.currentPage = 1; // Reset to page 1 when changing rows per page
    },
    setScrollPosition: (state, action: PayloadAction<number>) => {
      state.scrollPosition = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchVulnerabilities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchVulnerabilities.fulfilled,
        (state, action: PayloadAction<VulnerabilitiesResponse>) => {
          state.loading = false;
          state.items = action.payload.vulnerabilities;
          state.pagination = action.payload.pagination;
        }
      )
      .addCase(fetchVulnerabilities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch vulnerabilities';
      });
  },
});

export const { setFilters, clearFilters, resetVulnerabilities, setSorting, setCurrentPage, setRowsPerPage, setScrollPosition } =
  vulnerabilitiesSlice.actions;
export default vulnerabilitiesSlice.reducer;
