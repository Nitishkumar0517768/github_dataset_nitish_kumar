import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../services/api';

// Fetch all inventory stats in parallel
export const fetchStatsSummary = createAsyncThunk(
  'stats/fetchSummary',
  async (_, { rejectWithValue }) => {
    try {
      const endpoints = [
        { key: 'total', url: '/stats/datasets/count' },
        { key: 'functions', url: '/stats/datasets/functions' },
        { key: 'classes', url: '/stats/datasets/classes' },
        { key: 'documentation', url: '/stats/datasets/documentation' },
        { key: 'readme', url: '/stats/datasets/readme' },
        { key: 'repos', url: '/stats/datasets/repos' },
        { key: 'languages', url: '/stats/datasets/languages' },
        { key: 'frameworks', url: '/stats/datasets/frameworks' },
        { key: 'github', url: '/stats/datasets/github' },
        { key: 'ai', url: '/stats/datasets/ai' }
      ];

      const results = await Promise.all(
        endpoints.map(async (ep) => {
          const res = await apiClient.get(ep.url);
          return { key: ep.key, count: res.data.count, label: res.data.label };
        })
      );

      // Reduce results into an object
      const summary = results.reduce((acc, curr) => {
        acc[curr.key] = { count: curr.count, label: curr.label };
        return acc;
      }, {});

      return summary;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch inventory statistics');
    }
  }
);

const initialState = {
  summary: null,
  loading: false,
  error: null,
};

const statsSlice = createSlice({
  name: 'stats',
  initialState,
  reducers: {
    clearStatsError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStatsSummary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStatsSummary.fulfilled, (state, action) => {
        state.loading = false;
        state.summary = action.payload;
      })
      .addCase(fetchStatsSummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearStatsError } = statsSlice.actions;
export default statsSlice.reducer;
