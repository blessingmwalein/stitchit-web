import { apiRequest } from '@/lib/api/client';
import { tokenStorage } from '@/lib/auth/tokenStorage';

export type CustomerType = 'INDIVIDUAL' | 'CORPORATE';

export type Customer = {
  id: string;
  customerNumber: string;
  type: CustomerType;
  firstName?: string | null;
  lastName?: string | null;
  companyName?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  city?: string | null;
  country?: string | null;
  avatarUrl?: string | null;
  portalEnabled: boolean;
  createdAt: string;
};

// Backward-compatible alias
export type Client = Customer;

export type TokenPair = {
  accessToken: string;
  refreshToken: string;
};

export type AuthResponse = TokenPair & { customer: Customer };

export type RegisterRequest = {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  password: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type UpdateProfileRequest = {
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
};

export type ChangePasswordRequest = {
  currentPassword: string;
  newPassword: string;
};

// Legacy types kept for pages that used the Google flow (now unsupported via portal)
export type GoogleRedirectResponse = { url: string };
export type GoogleExchangeSessionRequest = { session: string };
export type GoogleExchangeSessionLogin = { type: 'login'; token: string; client: Client };
export type GoogleExchangeSessionRegister = {
  type: 'register'; googleId: string; email: string; firstName: string; lastName: string; avatarUrl?: string | null;
};
export type GoogleExchangeSessionResponse = GoogleExchangeSessionLogin | GoogleExchangeSessionRegister;
export type GoogleCompleteRegistrationRequest = {
  googleId: string; email: string; firstName: string; lastName: string; phone: string;
  address?: string; avatarUrl?: string;
};
export type CompleteGoogleRegistrationRequest = GoogleCompleteRegistrationRequest;
export type GoogleCompleteRegistrationResponse = AuthResponse;
export type CompleteGoogleRegistrationResponse = AuthResponse;

export const authApi = {
  register(payload: RegisterRequest): Promise<AuthResponse> {
    return apiRequest<AuthResponse>('/portal/auth/register', {
      method: 'POST',
      skipAuth: true,
      body: payload,
    });
  },

  login(payload: LoginRequest): Promise<AuthResponse> {
    return apiRequest<AuthResponse>('/portal/auth/login', {
      method: 'POST',
      skipAuth: true,
      body: payload,
    });
  },

  refresh(refreshToken: string): Promise<TokenPair> {
    return apiRequest<TokenPair>('/portal/auth/refresh', {
      method: 'POST',
      skipAuth: true,
      body: { refreshToken },
    });
  },

  getProfile(token: string): Promise<Customer> {
    return apiRequest<Customer>('/portal/me', { method: 'GET', token });
  },

  updateProfile(payload: UpdateProfileRequest): Promise<Customer> {
    return apiRequest<Customer>('/portal/me', { method: 'PATCH', body: payload });
  },

  changePassword(payload: ChangePasswordRequest): Promise<{ message: string }> {
    return apiRequest<{ message: string }>('/portal/me/password', { method: 'PATCH', body: payload });
  },

  logout(refreshToken: string): Promise<{ message: string }> {
    return apiRequest<{ message: string }>('/portal/auth/logout', {
      method: 'POST',
      skipAuth: true,
      body: { refreshToken },
    });
  },

  // Google OAuth is handled through redirect to /api/v1/auth/google
  // The web redirects users there and receives tokens back via query params
  getGoogleRedirectUrl(): Promise<GoogleRedirectResponse> {
    return Promise.resolve({ url: `${process.env.NEXT_PUBLIC_API_BASE_URL || '/api/v1'}/auth/google` });
  },

  exchangeGoogleSession(_payload: GoogleExchangeSessionRequest): Promise<GoogleExchangeSessionResponse> {
    return apiRequest<GoogleExchangeSessionResponse>('/auth/google/exchange-session', {
      method: 'POST',
      skipAuth: true,
      body: _payload,
    });
  },

  completeGoogleRegistration(payload: GoogleCompleteRegistrationRequest): Promise<AuthResponse> {
    return apiRequest<AuthResponse>('/auth/google/complete-registration', {
      method: 'POST',
      skipAuth: true,
      body: payload,
    });
  },
};

/** Call after a successful login/register to store both tokens */
export function storeAuthTokens(pair: TokenPair) {
  tokenStorage.setTokens(pair.accessToken, pair.refreshToken);
}
