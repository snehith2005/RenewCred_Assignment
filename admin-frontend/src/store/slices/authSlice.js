import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

export const loginAdmin = createAsyncThunk(
  'auth/loginAdmin',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/login', credentials);
      if (typeof window !== 'undefined') {
        localStorage.setItem('adminToken', response.data.token);
      }
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Login failed');
    }
  }
);

export const logoutAdmin = createAsyncThunk('auth/logoutAdmin', async () => {
  try {
    await api.post('/auth/logout');
  } catch (err) {
    // Ignore network errors on logout; we clear client state regardless.
  }
  if (typeof window !== 'undefined') {
    localStorage.removeItem('adminToken');
  }
});

const getInitialToken = () =>
  typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: getInitialToken(),
    admin: null,
    isAuthenticated: !!getInitialToken(),
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loginAdmin.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.admin = action.payload.admin;
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(logoutAdmin.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.token = null;
        state.admin = null;
      });
  },
});

export default authSlice.reducer;
