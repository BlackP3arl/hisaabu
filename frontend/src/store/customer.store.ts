import { create } from 'zustand';
import { customerApi, Customer, CreateCustomerData, UpdateCustomerData } from '../api/customer.api';

interface CustomerStore {
  customers: Customer[];
  loading: boolean;
  error: string | null;

  fetchAll: () => Promise<void>;
  create: (data: CreateCustomerData) => Promise<Customer>;
  update: (id: string, data: UpdateCustomerData) => Promise<Customer>;
  delete: (id: string) => Promise<void>;
  clearError: () => void;
}

export const useCustomerStore = create<CustomerStore>((set) => ({
  customers: [],
  loading: false,
  error: null,

  fetchAll: async () => {
    set({ loading: true, error: null });
    try {
      const customers = await customerApi.getAll();
      set({ customers, loading: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch customers';
      set({ error: message, loading: false });
    }
  },

  create: async (data: CreateCustomerData) => {
    set({ loading: true, error: null });
    try {
      const customer = await customerApi.create(data);
      set((state) => ({
        customers: [customer, ...state.customers],
        loading: false,
      }));
      return customer;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create customer';
      set({ error: message, loading: false });
      throw error;
    }
  },

  update: async (id: string, data: UpdateCustomerData) => {
    set({ loading: true, error: null });
    try {
      const updated = await customerApi.update(id, data);
      set((state) => ({
        customers: state.customers.map((c) => (c.id === id ? updated : c)),
        loading: false,
      }));
      return updated;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update customer';
      set({ error: message, loading: false });
      throw error;
    }
  },

  delete: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await customerApi.delete(id);
      set((state) => ({
        customers: state.customers.filter((c) => c.id !== id),
        loading: false,
      }));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete customer';
      set({ error: message, loading: false });
      throw error;
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));
