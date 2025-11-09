import axios from 'axios';
import { useAuthStore } from '../store/auth.store';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5002/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

// Auto-inject auth token
apiClient.interceptors.request.use((config) => {
  const { accessToken } = useAuthStore.getState();
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

export interface Customer {
  id: string;
  companyId: string;
  name: string;
  email?: string;
  phone?: string;
  website?: string;
  gstTinNumber?: string;
  contactPerson?: string;
  designation?: string;
  notes?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCustomerData {
  name: string;
  email?: string;
  phone?: string;
  website?: string;
  gstTinNumber?: string;
  contactPerson?: string;
  designation?: string;
  notes?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
  };
  isActive?: boolean;
}

export interface UpdateCustomerData extends Partial<CreateCustomerData> {}

export const customerApi = {
  /**
   * Get all customers
   */
  getAll: async (): Promise<Customer[]> => {
    const response = await apiClient.get('/customers');
    return response.data.data;
  },

  /**
   * Get customer by ID
   */
  getById: async (id: string): Promise<Customer> => {
    const response = await apiClient.get(`/customers/${id}`);
    return response.data.data;
  },

  /**
   * Create new customer
   */
  create: async (data: CreateCustomerData): Promise<Customer> => {
    const response = await apiClient.post('/customers', data);
    return response.data.data;
  },

  /**
   * Update customer
   */
  update: async (id: string, data: UpdateCustomerData): Promise<Customer> => {
    const response = await apiClient.put(`/customers/${id}`, data);
    return response.data.data;
  },

  /**
   * Delete customer
   */
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/customers/${id}`);
  },
};
