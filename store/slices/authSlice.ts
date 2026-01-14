import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { authApi, type Client, type CompleteGoogleRegistrationRequest, type RegisterRequest } from '@/lib/api/auth';
import type { FieldErrors } from '@/lib/api/client';
import { isApiError } from '@/lib/api/client';
import { tokenStorage } from '@/lib/auth/tokenStorage';

type RejectedValue = {
  message: string;
  errors?: FieldErrors;
};

export interface AuthState {
  client: Client | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  hydrated: boolean;
  error: string | null;
  fieldErrors: FieldErrors | null;
}

const initialState: AuthState = {
  client: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  hydrated: false,
  error: null,
  fieldErrors: null,
};

export const registerClient = createAsyncThunk<
  { client: Client; token: string },
  RegisterRequest,
  { rejectValue: RejectedValue }
>('auth/registerClient', async (payload, { rejectWithValue }) => {
  try {
    const res = await authApi.register(payload);
    return { client: res.data.client, token: res.data.token };
  } catch (error) {
    if (isApiError(error)) return rejectWithValue({ message: error.message, errors: error.errors });
    return rejectWithValue({ message: 'Registration failed' });
  }
});

export const loginClient = createAsyncThunk<
  { client: Client; token: string },
  { login: string; password: string },
  { rejectValue: RejectedValue }
>('auth/loginClient', async (payload, { rejectWithValue }) => {
  try {
    const res = await authApi.login(payload);
    return { client: res.data.client, token: res.data.token };
  } catch (error) {
    if (isApiError(error)) return rejectWithValue({ message: error.message, errors: error.errors });
    return rejectWithValue({ message: 'Login failed' });
  }
});

export const fetchProfile = createAsyncThunk<
  Client,
  void,
  { state: { auth: AuthState }; rejectValue: RejectedValue }
>('auth/fetchProfile', async (_unused, { getState, rejectWithValue }) => {
  const token = getState().auth.token;
  if (!token) return rejectWithValue({ message: 'Not authenticated' });

  try {
    const res = await authApi.getProfile(token);
    return res.data;
  } catch (error) {
    if (isApiError(error)) return rejectWithValue({ message: error.message, errors: error.errors });
    return rejectWithValue({ message: 'Failed to load profile' });
  }
});

export const hydrateAuth = createAsyncThunk<
  { token: string; client: Client },
  void,
  { rejectValue: RejectedValue }
>('auth/hydrateAuth', async (_unused, { rejectWithValue }) => {
  const token = tokenStorage.getToken();
  if (!token) return rejectWithValue({ message: 'No token' });

  try {
    const res = await authApi.getProfile(token);
    return { token, client: res.data };
  } catch (error) {
    tokenStorage.clearToken();
    if (isApiError(error)) return rejectWithValue({ message: error.message, errors: error.errors });
    return rejectWithValue({ message: 'Session expired' });
  }
});

export const logoutClient = createAsyncThunk<void, void, { state: { auth: AuthState } }>(
  'auth/logoutClient',
  async (_unused, { getState }) => {
    const token = getState().auth.token;
    try {
      if (token) await authApi.logout(token);
    } finally {
      tokenStorage.clearToken();
    }
  }
);

export const completeGoogleRegistration = createAsyncThunk<
  { client: Client; token: string },
  CompleteGoogleRegistrationRequest,
  { rejectValue: RejectedValue }
>('auth/completeGoogleRegistration', async (payload, { rejectWithValue }) => {
  try {
    const res = await authApi.completeGoogleRegistration(payload);
    return { client: res.data.client, token: res.data.token };
  } catch (error) {
    if (isApiError(error)) return rejectWithValue({ message: error.message, errors: error.errors });
    return rejectWithValue({ message: 'Registration failed' });
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Backward-compatible: some pages still call these.
    setUser: (state, action: PayloadAction<any>) => {
      state.client = action.payload as Client;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.client = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      state.fieldErrors = null;
      tokenStorage.clearToken();
    },
    updateUser: (state, action: PayloadAction<Partial<Client>>) => {
      if (state.client) state.client = { ...state.client, ...action.payload };
    },
    setSession: (state, action: PayloadAction<{ token: string; client: Client }>) => {
      state.token = action.payload.token;
      state.client = action.payload.client;
      state.isAuthenticated = true;
      state.hydrated = true;
      state.error = null;
      state.fieldErrors = null;
      tokenStorage.setToken(action.payload.token);
    },
    clearAuthError: (state) => {
      state.error = null;
      state.fieldErrors = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerClient.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.fieldErrors = null;
      })
      .addCase(registerClient.fulfilled, (state, action) => {
        state.loading = false;
        state.client = action.payload.client;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        tokenStorage.setToken(action.payload.token);
      })
      .addCase(registerClient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Registration failed';
        state.fieldErrors = action.payload?.errors || null;
      })
      .addCase(loginClient.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.fieldErrors = null;
      })
      .addCase(loginClient.fulfilled, (state, action) => {
        state.loading = false;
        state.client = action.payload.client;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        tokenStorage.setToken(action.payload.token);
      })
      .addCase(loginClient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Login failed';
        state.fieldErrors = action.payload?.errors || null;
      })
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.fieldErrors = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.client = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to load profile';
        state.fieldErrors = action.payload?.errors || null;
      })
      .addCase(hydrateAuth.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.fieldErrors = null;
      })
      .addCase(hydrateAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.hydrated = true;
        state.token = action.payload.token;
        state.client = action.payload.client;
        state.isAuthenticated = true;
      })
      .addCase(hydrateAuth.rejected, (state) => {
        state.loading = false;
        state.hydrated = true;
        state.token = null;
        state.client = null;
        state.isAuthenticated = false;
      })
      .addCase(logoutClient.fulfilled, (state) => {
        state.client = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = null;
        state.fieldErrors = null;
      })
      .addCase(completeGoogleRegistration.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.fieldErrors = null;
      })
      .addCase(completeGoogleRegistration.fulfilled, (state, action) => {
        state.loading = false;
        state.client = action.payload.client;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        tokenStorage.setToken(action.payload.token);
      })
      .addCase(completeGoogleRegistration.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Registration failed';
        state.fieldErrors = action.payload?.errors || null;
      });
  },
});

export const { setUser, logout, updateUser, setSession, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
