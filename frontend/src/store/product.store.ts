import { create } from 'zustand';
import { productApi, Product, CreateProductData, UpdateProductData } from '../api/product.api';

interface ProductStore {
  products: Product[];
  loading: boolean;
  error: string | null;

  fetchAll: () => Promise<void>;
  create: (data: CreateProductData) => Promise<Product>;
  update: (id: string, data: UpdateProductData) => Promise<Product>;
  delete: (id: string) => Promise<void>;
  clearError: () => void;
}

export const useProductStore = create<ProductStore>((set) => ({
  products: [],
  loading: false,
  error: null,

  fetchAll: async () => {
    set({ loading: true, error: null });
    try {
      const products = await productApi.getAll();
      set({ products, loading: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch products';
      set({ error: message, loading: false });
    }
  },

  create: async (data: CreateProductData) => {
    set({ loading: true, error: null });
    try {
      const product = await productApi.create(data);
      set((state) => ({
        products: [product, ...state.products],
        loading: false,
      }));
      return product;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create product';
      set({ error: message, loading: false });
      throw error;
    }
  },

  update: async (id: string, data: UpdateProductData) => {
    set({ loading: true, error: null });
    try {
      const updated = await productApi.update(id, data);
      set((state) => ({
        products: state.products.map((p) => (p.id === id ? updated : p)),
        loading: false,
      }));
      return updated;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update product';
      set({ error: message, loading: false });
      throw error;
    }
  },

  delete: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await productApi.delete(id);
      set((state) => ({
        products: state.products.filter((p) => p.id !== id),
        loading: false,
      }));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete product';
      set({ error: message, loading: false });
      throw error;
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));
