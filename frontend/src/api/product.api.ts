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

export interface Product {
  id: string;
  companyId: string;
  name: string;
  description?: string;
  sku?: string;
  unitPrice: number | string;
  taxRate: number | string;
  category?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductData {
  name: string;
  description?: string;
  sku?: string;
  unitPrice: number | string;
  taxRate?: number | string;
  category?: string;
  isActive?: boolean;
}

export interface UpdateProductData extends Partial<CreateProductData> {}

export const productApi = {
  /**
   * Get all products
   */
  getAll: async (): Promise<Product[]> => {
    const response = await apiClient.get('/products');
    return response.data.data;
  },

  /**
   * Get product by ID
   */
  getById: async (id: string): Promise<Product> => {
    const response = await apiClient.get(`/products/${id}`);
    return response.data.data;
  },

  /**
   * Create new product
   */
  create: async (data: CreateProductData): Promise<Product> => {
    const response = await apiClient.post('/products', data);
    return response.data.data;
  },

  /**
   * Update product
   */
  update: async (id: string, data: UpdateProductData): Promise<Product> => {
    const response = await apiClient.put(`/products/${id}`, data);
    return response.data.data;
  },

  /**
   * Delete product
   */
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/products/${id}`);
  },
};
