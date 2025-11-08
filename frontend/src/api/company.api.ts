import axios from 'axios';
import { useAuthStore } from '../store/auth.store';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5002/api';

// Create axios instance with interceptor for auth headers
const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

// Add request interceptor to include auth token
apiClient.interceptors.request.use((config) => {
  const { accessToken } = useAuthStore.getState();
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export interface CompanyProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  website: string | null;
  logoUrl: string | null;
  gstTinNumber: string | null;
  defaultCurrencyCode: string;
  headerNote: string | null;
  footerNote: string | null;
  defaultTerms: string | null;
  defaultInvoiceTerms: string | null;
  defaultQuotationTerms: string | null;
  address: {
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
  } | null;
  socialLinks: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    twitter?: string;
  } | null;
  bankAccounts: Array<{
    bankName: string;
    accountHolder: string;
    accountNumber: string;
    ifscCode: string;
    branchName?: string;
  }> | null;
  status: string;
  plan: string;
  createdAt: string;
}

export interface UpdateCompanyProfileData {
  name?: string;
  email?: string;
  phone?: string;
  website?: string;
  gstTinNumber?: string;
  defaultCurrencyCode?: string;
  headerNote?: string;
  footerNote?: string;
  defaultTerms?: string;
  defaultInvoiceTerms?: string;
  defaultQuotationTerms?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
  };
  socialLinks?: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    twitter?: string;
  };
  bankAccounts?: Array<{
    bankName: string;
    accountHolder: string;
    accountNumber: string;
    ifscCode: string;
    branchName?: string;
  }>;
}

export const companyApi = {
  /**
   * Get company profile
   */
  getProfile: async (): Promise<CompanyProfile> => {
    const response = await apiClient.get('/company/profile');
    return response.data.data;
  },

  /**
   * Update company profile
   */
  updateProfile: async (data: UpdateCompanyProfileData): Promise<CompanyProfile> => {
    const response = await apiClient.put('/company/profile', data);
    return response.data.data;
  },

  /**
   * Upload company logo
   */
  uploadLogo: async (file: File): Promise<{ logoUrl: string }> => {
    const formData = new FormData();
    formData.append('logo', file);

    const response = await apiClient.post('/company/logo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  },
};
