import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"

interface User {
  id: number
  name: string
  email: string
  email_verified_at: string | null
  two_factor_confirmed_at: string | null
  current_team_id: number | null
  profile_photo_path: string | null
  profile_photo_url: string
  created_at: string
  updated_at: string
  // Additional fields for registration
  gender?: string
  phone_number?: string
  address?: string
  city?: string
}

interface AuthState {
  isLoggedIn: boolean
  user: User | null
  token: string | null
  loading: boolean
  error: string | null
}

const initialState: AuthState = {
  isLoggedIn: false,
  user: null,
  token: null,
  loading: false,
  error: null,
}

// API Base URL
const API_BASE_URL = "http://stitchit.test/api/auth/client"

// Async thunks for API calls
export const loginAsync = createAsyncThunk(
  "auth/login",
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(credentials),
      })

      const data = await response.json()

      if (!response.ok) {
        return rejectWithValue(data)
      }

      // Store token in localStorage
      if (data.response?.token) {
        localStorage.setItem("auth_token", data.response.token)
      }

      return data
    } catch (error) {
      return rejectWithValue({ message: "Network error occurred" })
    }
  },
)

export const registerAsync = createAsyncThunk(
  "auth/register",
  async (
    userData: {
      name: string
      email: string
      gender: string
      phone_number: string
      address: string
      city: string
      role: string
      password: string
      password_confirmation: string
    },
    { rejectWithValue },
  ) => {
    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(userData),
      })

      const data = await response.json()

      if (!response.ok) {
        return rejectWithValue(data)
      }

      return data
    } catch (error) {
      return rejectWithValue({ message: "Network error occurred" })
    }
  },
)

// Check if user is already logged in (on app startup)
export const checkAuthStatus = createAsyncThunk("auth/checkStatus", async (_, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem("auth_token")
    if (!token) {
      return rejectWithValue({ message: "No token found" })
    }

    // You can add an API call here to verify the token is still valid
    // For now, we'll just return the token
    return { token }
  } catch (error) {
    return rejectWithValue({ message: "Token validation failed" })
  }
})

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.isLoggedIn = false
      state.user = null
      state.token = null
      state.error = null
      localStorage.removeItem("auth_token")
    },
    clearError: (state) => {
      state.error = null
    },
    updateProfile: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload }
      }
    },
  },
  extraReducers: (builder) => {
    // Login cases
    builder
      .addCase(loginAsync.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginAsync.fulfilled, (state, action) => {
        state.loading = false
        state.isLoggedIn = true
        state.user = action.payload.response.user
        state.token = action.payload.response.token
        state.error = null
      })
      .addCase(loginAsync.rejected, (state, action: any) => {
        state.loading = false
        state.isLoggedIn = false
        state.user = null
        state.token = null
        if (action.payload?.errors) {
          state.error = action.payload.errors
        } else if (action.payload?.message) {
          state.error = action.payload.message
        } else {
          state.error = "Login failed"
        }
      })

    // Register cases
    builder
      .addCase(registerAsync.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(registerAsync.fulfilled, (state, action) => {
        state.loading = false
        state.isLoggedIn = true
        state.user = action.payload.response
        state.error = null
        // Note: Registration response doesn't include token, so user might need to login
      })
      .addCase(registerAsync.rejected, (state, action: any) => {
        state.loading = false
        state.isLoggedIn = false
        state.user = null
        state.token = null
        if (action.payload?.errors) {
          // Handle validation errors
          const errors = action.payload.errors
          if (typeof errors === "object") {
            const errorMessages = Object.values(errors).flat()
            state.error = errorMessages.join(", ")
          } else {
            state.error = errors
          }
        } else {
          state.error = action.payload?.message || "Registration failed"
        }
      })

    // Check auth status cases
    builder
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        state.token = action.payload.token
        // Note: You might want to fetch user data here if token is valid
      })
      .addCase(checkAuthStatus.rejected, (state) => {
        state.isLoggedIn = false
        state.user = null
        state.token = null
      })
  },
})

export const { logout, clearError, updateProfile } = authSlice.actions
export default authSlice.reducer
