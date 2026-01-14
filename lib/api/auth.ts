import { apiRequest } from '@/lib/api/client';

export type Gender = 'male' | 'female' | 'other';

export type Client = {
  id: number;
  full_name: string;
  phone: string;
  email?: string | null;
  username?: string | null;
  address?: string | null;
  gender?: Gender | null;
  nickname?: string | null;
  avatar?: string | null;
};

export type ApiEnvelope<T> = {
  success: boolean;
  message?: string;
  data: T;
};

export type RegisterRequest = {
  full_name: string;
  phone: string;
  email?: string;
  username?: string;
  password: string;
  password_confirmation: string;
  address?: string;
  gender?: Gender;
};

export type RegisterResponse = ApiEnvelope<{ client: Client; token: string }>;

export type LoginRequest = {
  login: string;
  password: string;
};

export type LoginResponse = ApiEnvelope<{ client: Client; token: string }>;

export type ProfileResponse = ApiEnvelope<Client>;

export type UpdateProfileRequest = {
  full_name?: string;
  email?: string;
  username?: string;
  address?: string;
  gender?: Gender;
  nickname?: string;
};

export type UpdateProfileResponse = ApiEnvelope<Client>;

export type LogoutResponse = ApiEnvelope<unknown>;

export type GoogleRedirectResponse = ApiEnvelope<{ url: string }>;

export type GoogleExchangeSessionRequest = {
  session: string;
};

export type GoogleExchangeSessionLogin = {
  type: 'login';
  token: string;
  client: Client;
};

export type GoogleExchangeSessionRegister = {
  type: 'register';
  google_id: string;
  email: string;
  full_name: string;
  avatar?: string | null;
};

export type GoogleExchangeSessionResponse = ApiEnvelope<GoogleExchangeSessionLogin | GoogleExchangeSessionRegister>;

export type GoogleCompleteRegistrationRequest = {
  google_id: string;
  email: string;
  full_name: string;
  phone: string;
  username?: string;
  address?: string;
  gender?: Gender;
  avatar?: string;
};

export type GoogleCompleteRegistrationResponse = ApiEnvelope<{ client: Client; token: string }>;

// Backward-compatible aliases (used by existing pages/slices)
export type CompleteGoogleRegistrationRequest = GoogleCompleteRegistrationRequest;
export type CompleteGoogleRegistrationResponse = GoogleCompleteRegistrationResponse;

export const authApi = {
  register(payload: RegisterRequest) {
    return apiRequest<RegisterResponse>('/auth/register', {
      method: 'POST',
      skipAuth: true,
      body: payload,
    });
  },

  login(payload: LoginRequest) {
    return apiRequest<LoginResponse>('/auth/login', {
      method: 'POST',
      skipAuth: true,
      body: payload,
    });
  },

  getProfile(token: string) {
    return apiRequest<ProfileResponse>('/profile', {
      method: 'GET',
      token,
    });
  },

  updateProfile(token: string, payload: UpdateProfileRequest) {
    return apiRequest<UpdateProfileResponse>('/profile', {
      method: 'PUT',
      token,
      body: payload,
    });
  },

  logout(token: string) {
    return apiRequest<LogoutResponse>('/logout', {
      method: 'POST',
      token,
    });
  },

  getGoogleRedirectUrl() {
    return apiRequest<GoogleRedirectResponse>('/auth/google/redirect', {
      method: 'GET',
      skipAuth: true,
    });
  },

  exchangeGoogleSession(payload: GoogleExchangeSessionRequest) {
    return apiRequest<GoogleExchangeSessionResponse>('/auth/google/exchange-session', {
      method: 'POST',
      skipAuth: true,
      body: payload,
    });
  },

  completeGoogleRegistration(payload: CompleteGoogleRegistrationRequest) {
    return apiRequest<CompleteGoogleRegistrationResponse>('/auth/google/complete-registration', {
      method: 'POST',
      skipAuth: true,
      body: payload,
    });
  },
};
