const ACCESS_KEY = 'auth_token';
const REFRESH_KEY = 'auth_refresh';

export const tokenStorage = {
  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return window.localStorage.getItem(ACCESS_KEY);
  },

  setToken(token: string) {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(ACCESS_KEY, token);
  },

  clearToken() {
    if (typeof window === 'undefined') return;
    window.localStorage.removeItem(ACCESS_KEY);
  },

  getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null;
    return window.localStorage.getItem(REFRESH_KEY);
  },

  setRefreshToken(token: string) {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(REFRESH_KEY, token);
  },

  setTokens(access: string, refresh: string) {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(ACCESS_KEY, access);
    window.localStorage.setItem(REFRESH_KEY, refresh);
  },

  clearAll() {
    if (typeof window === 'undefined') return;
    window.localStorage.removeItem(ACCESS_KEY);
    window.localStorage.removeItem(REFRESH_KEY);
  },
};
