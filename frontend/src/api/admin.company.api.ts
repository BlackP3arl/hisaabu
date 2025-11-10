import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5002/api';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

// Add authorization interceptor
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface Company {
  id: string;
  name: string;
  email: string;
  phone?: string;
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
  plan: string;
  createdAt: string;
  approvedAt?: string;
  approvedById?: string;
}

export interface CompaniesResponse {
  data: Company[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface UpdateCompanyStatusRequest {
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
}

export interface UpdateCompanyPlanRequest {
  plan: string;
}

export const adminCompanyApi = {
  /**
   * Get all companies with pagination
   */
  getAll: async (page: number = 1, limit: number = 10): Promise<CompaniesResponse> => {
    const response = await axiosInstance.get('/admin/companies', {
      params: { page, limit },
    });
    return response.data.data;
  },

  /**
   * Get company detail
   */
  getById: async (companyId: string): Promise<Company> => {
    const response = await axiosInstance.get(`/admin/companies/${companyId}`);
    return response.data.data;
  },

  /**
   * Update company status
   */
  updateStatus: async (
    companyId: string,
    data: UpdateCompanyStatusRequest
  ): Promise<Company> => {
    const response = await axiosInstance.put(`/admin/companies/${companyId}/status`, data);
    return response.data.data;
  },

  /**
   * Update company plan
   */
  updatePlan: async (
    companyId: string,
    data: UpdateCompanyPlanRequest
  ): Promise<Company> => {
    const response = await axiosInstance.put(`/admin/companies/${companyId}/plan`, data);
    return response.data.data;
  },
};
