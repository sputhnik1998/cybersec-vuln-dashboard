import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { getVulnerabilities } from '../services/api';
import type { Vulnerability, VulnerabilitiesResponse } from '../services/api';

interface PaginationInfo {
  currentPage: number;
  limit: number;
  hasMore: boolean;
  nextCursor: string | null;
  totalCount: number | null;
}

interface VulnerabilitiesState {
  items: Vulnerability[];
  pagination: PaginationInfo | null;
  loading: boolean;
  error: string | null;
  filters: {
    severity: string;
    status: string;
    packageName: string;
    cve: string;
  };
  currentCursor: string | null;
  pageCursors: Record<number, string | null>; // Store cursor for each page
}

const initialState: VulnerabilitiesState = {
  items: [],
  pagination: null,
  loading: false,
  error: null,
  filters: {
    severity: '',
    status: '',
    packageName: '',
    cve: '',
  },
  currentCursor: null,
  pageCursors: { 1: null }, // Page 1 starts with no cursor
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
  cursor?: string | null;
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
      state.currentCursor = null; // Reset cursor when filters change
      state.pageCursors = { 1: null }; // Reset page cursors
    },
    clearFilters: (state) => {
      state.filters = {
        severity: '',
        status: '',
        packageName: '',
        cve: '',
      };
      state.currentCursor = null;
      state.pageCursors = { 1: null };
    },
    resetVulnerabilities: (state) => {
      state.items = [];
      state.pagination = null;
      state.error = null;
      state.currentCursor = null;
      state.pageCursors = { 1: null };
    },
    setCurrentCursor: (state, action: PayloadAction<string | null>) => {
      state.currentCursor = action.payload;
    },
    setPageCursor: (state, action: PayloadAction<{ page: number; cursor: string | null }>) => {
      state.pageCursors[action.payload.page] = action.payload.cursor;
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

          // Preserve totalCount from first page load
          const newPagination = action.payload.pagination;
          if (newPagination.totalCount !== null) {
            state.pagination = newPagination;
          } else if (state.pagination) {
            // Keep the old totalCount but update other pagination fields
            state.pagination = {
              ...newPagination,
              totalCount: state.pagination.totalCount,
            };
          } else {
            state.pagination = newPagination;
          }

          state.currentCursor = action.payload.pagination.nextCursor;

          // Store the cursor for the next page
          const currentPage = action.payload.pagination.currentPage;
          const nextPage = currentPage + 1;
          if (action.payload.pagination.nextCursor) {
            state.pageCursors[nextPage] = action.payload.pagination.nextCursor;
          }
        }
      )
      .addCase(fetchVulnerabilities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch vulnerabilities';
      });
  },
});

export const { setFilters, clearFilters, resetVulnerabilities, setCurrentCursor, setPageCursor } =
  vulnerabilitiesSlice.actions;
export default vulnerabilitiesSlice.reducer;
