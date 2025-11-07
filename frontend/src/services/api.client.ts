import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { ApiResponse } from '../types/auth.types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5002/api';

class ApiClient {
  private client: AxiosInstance;
  private refreshTokenUrl = `${API_BASE_URL}/admin/auth/refresh`;
  private isRefreshing = false;
  private refreshSubscribers: ((token: string) => void)[] = [];

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          if (!this.isRefreshing) {
            this.isRefreshing = true;
            try {
              const refreshToken = localStorage.getItem('refreshToken');
              const response = await axios.post<ApiResponse<{ accessToken: string; refreshToken: string }>>(
                this.refreshTokenUrl,
                { refreshToken }
              );

              if (response.data.success && response.data.data) {
                const { accessToken, refreshToken: newRefreshToken } = response.data.data;
                localStorage.setItem('accessToken', accessToken);
                localStorage.setItem('refreshToken', newRefreshToken);

                this.onRefreshed(accessToken);
                this.isRefreshing = false;

                // Retry original request with new token
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                return this.client(originalRequest);
              }
            } catch (err) {
              this.isRefreshing = false;
              localStorage.removeItem('accessToken');
              localStorage.removeItem('refreshToken');
              window.location.href = '/login';
              return Promise.reject(err);
            }
          }

          // Wait for token refresh
          return new Promise((resolve) => {
            this.subscribeTokenRefresh((token: string) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(this.client(originalRequest));
            });
          });
        }

        return Promise.reject(error);
      }
    );
  }

  private onRefreshed(token: string) {
    this.refreshSubscribers.forEach((callback) => callback(token));
    this.refreshSubscribers = [];
  }

  private subscribeTokenRefresh(callback: (token: string) => void) {
    this.refreshSubscribers.push(callback);
  }

  // Public methods
  get<T = any>(url: string, config?: any) {
    return this.client.get<ApiResponse<T>>(url, config);
  }

  post<T = any>(url: string, data?: any, config?: any) {
    return this.client.post<ApiResponse<T>>(url, data, config);
  }

  put<T = any>(url: string, data?: any, config?: any) {
    return this.client.put<ApiResponse<T>>(url, data, config);
  }

  patch<T = any>(url: string, data?: any, config?: any) {
    return this.client.patch<ApiResponse<T>>(url, data, config);
  }

  delete<T = any>(url: string, config?: any) {
    return this.client.delete<ApiResponse<T>>(url, config);
  }
}

export const apiClient = new ApiClient();
