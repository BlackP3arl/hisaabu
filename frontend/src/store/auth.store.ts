import { create } from 'zustand';
import { apiClient } from '../services/api.client';
import {
  AuthContextType,
  PlatformAdmin,
  CompanyUser,
  CompanyInfo,
  RegisterCompanyPayload,
  RegisterCompanyResponse,
  AdminLoginResponse,
  UserLoginResponse,
} from '../types/auth.types';

interface AuthState extends AuthContextType {
  setLoading: (loading: boolean) => void;
  setAdmin: (admin: PlatformAdmin | null) => void;
  setUser: (user: CompanyUser | null, company: CompanyInfo | null) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => {
  // Initialize from localStorage
  const savedAccessToken = localStorage.getItem('accessToken');
  const savedRefreshToken = localStorage.getItem('refreshToken');
  const savedUserType = (localStorage.getItem('userType') as 'admin' | 'company' | null) || null;
  const savedAdmin = localStorage.getItem('admin') ? JSON.parse(localStorage.getItem('admin')!) : null;
  const savedUser = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null;
  const savedCompany = localStorage.getItem('company') ? JSON.parse(localStorage.getItem('company')!) : null;

  return {
    // Initial state
    isAuthenticated: !!savedAccessToken,
    isLoading: false,
    userType: savedUserType,
    admin: savedAdmin,
    user: savedUser,
    company: savedCompany,
    accessToken: savedAccessToken,
    refreshToken: savedRefreshToken,

    // Setters
    setLoading: (loading) => set({ isLoading: loading }),
    setAdmin: (admin) => {
      set({ admin });
      if (admin) {
        localStorage.setItem('admin', JSON.stringify(admin));
      } else {
        localStorage.removeItem('admin');
      }
    },
    setUser: (user, company) => {
      set({ user, company });
      if (user && company) {
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('company', JSON.stringify(company));
      } else {
        localStorage.removeItem('user');
        localStorage.removeItem('company');
      }
    },
    setTokens: (accessToken, refreshToken) => {
      set({ accessToken, refreshToken, isAuthenticated: true });
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
    },
    clearAuth: () => {
      set({
        isAuthenticated: false,
        userType: null,
        admin: null,
        user: null,
        company: null,
        accessToken: null,
        refreshToken: null,
      });
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('userType');
      localStorage.removeItem('admin');
      localStorage.removeItem('user');
      localStorage.removeItem('company');
    },

    // Actions
    loginAsAdmin: async (email, password) => {
      try {
        set({ isLoading: true });
        const response = await apiClient.post<AdminLoginResponse>('/admin/auth/login', {
          email,
          password,
        });

        if (response.data.success && response.data.data) {
          const { user, accessToken, refreshToken } = response.data.data;
          get().setAdmin(user);
          get().setTokens(accessToken, refreshToken);
          set({ userType: 'admin' });
          localStorage.setItem('userType', 'admin');
        } else {
          throw new Error(response.data.error || 'Login failed');
        }
      } finally {
        set({ isLoading: false });
      }
    },

    registerCompany: async (payload) => {
      try {
        set({ isLoading: true });
        const response = await apiClient.post<RegisterCompanyResponse>('/auth/register-company', payload);

        if (response.data.success && response.data.data) {
          return response.data.data;
        } else {
          const error = new Error(response.data.error || 'Registration failed') as any;
          error.response = response;
          throw error;
        }
      } catch (error: any) {
        const errorMsg = error.response?.data?.error || error.message || 'Registration failed';
        const err = new Error(errorMsg) as any;
        err.response = error.response;
        throw err;
      } finally {
        set({ isLoading: false });
      }
    },

    loginAsCompanyUser: async (email, password) => {
      try {
        set({ isLoading: true });
        const response = await apiClient.post<UserLoginResponse>('/auth/login', {
          email,
          password,
        });

        if (response.data.success && response.data.data) {
          const { user, company, accessToken, refreshToken } = response.data.data;
          get().setUser(user, company);
          get().setTokens(accessToken, refreshToken);
          set({ userType: 'company' });
          localStorage.setItem('userType', 'company');
        } else {
          throw new Error(response.data.error || 'Login failed');
        }
      } finally {
        set({ isLoading: false });
      }
    },

    logout: () => {
      get().clearAuth();
    },

    refreshTokens: async () => {
      try {
        const refreshToken = get().refreshToken;
        if (!refreshToken) throw new Error('No refresh token available');

        const response = await apiClient.post<{ accessToken: string; refreshToken: string }>(
          '/admin/auth/refresh',
          { refreshToken }
        );

        if (response.data.success && response.data.data) {
          const { accessToken, refreshToken: newRefreshToken } = response.data.data;
          get().setTokens(accessToken, newRefreshToken);
        } else {
          throw new Error('Token refresh failed');
        }
      } catch (error) {
        get().logout();
        throw error;
      }
    },

    getMe: async () => {
      try {
        set({ isLoading: true });
        const userType = get().userType;

        if (userType === 'admin') {
          const response = await apiClient.get<{ user: PlatformAdmin }>('/admin/auth/me');
          if (response.data.success && response.data.data) {
            get().setAdmin(response.data.data.user);
          }
        } else if (userType === 'company') {
          const response = await apiClient.get<{ user: CompanyUser; company: CompanyInfo }>('/auth/me');
          if (response.data.success && response.data.data) {
            get().setUser(response.data.data.user, response.data.data.company);
          }
        }
      } finally {
        set({ isLoading: false });
      }
    },
  };
});
