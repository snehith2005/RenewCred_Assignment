import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

export const fetchPages = createAsyncThunk('pages/fetchPages', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/content/pages');
    return res.data.pages;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to load pages');
  }
});

export const fetchPageBySlug = createAsyncThunk(
  'pages/fetchPageBySlug',
  async (slug, { rejectWithValue }) => {
    try {
      const res = await api.get(`/content/pages/${slug}`);
      return res.data.page;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to load page');
    }
  }
);

export const createPage = createAsyncThunk(
  'pages/createPage',
  async (payload, { rejectWithValue }) => {
    try {
      const res = await api.post('/content/pages', payload);
      return res.data.page;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to create page');
    }
  }
);

export const updatePage = createAsyncThunk(
  'pages/updatePage',
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/content/pages/${id}`, payload);
      return res.data.page;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update page');
    }
  }
);

export const deletePage = createAsyncThunk(
  'pages/deletePage',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/content/pages/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to delete page');
    }
  }
);

const pagesSlice = createSlice({
  name: 'pages',
  initialState: {
    items: [],
    current: null,
    isLoading: false,
    error: null,
  },
  reducers: {
    clearCurrentPage: (state) => {
      state.current = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPages.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPages.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchPages.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchPageBySlug.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPageBySlug.fulfilled, (state, action) => {
        state.isLoading = false;
        state.current = action.payload;
      })
      .addCase(fetchPageBySlug.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(createPage.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
        state.current = action.payload;
      })
      .addCase(updatePage.fulfilled, (state, action) => {
        state.current = action.payload;
        const idx = state.items.findIndex((p) => p._id === action.payload._id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(deletePage.fulfilled, (state, action) => {
        state.items = state.items.filter((p) => p._id !== action.payload);
      })
      .addMatcher(
        (action) => action.type.endsWith('/rejected') && action.type.startsWith('pages/'),
        (state, action) => {
          state.error = action.payload;
        }
      );
  },
});

export const { clearCurrentPage } = pagesSlice.actions;
export default pagesSlice.reducer;
