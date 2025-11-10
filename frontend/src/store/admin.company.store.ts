import { create } from 'zustand';
import { adminCompanyApi, Company, CompaniesResponse } from '../api/admin.company.api';

interface AdminCompanyStore {
  companies: Company[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  loading: boolean;
  error: string | null;

  // Actions
  fetchCompanies: (page?: number, limit?: number) => Promise<void>;
  updateCompanyStatus: (companyId: string, status: string) => Promise<void>;
  updateCompanyPlan: (companyId: string, plan: string) => Promise<void>;
  clearError: () => void;
}

export const useAdminCompanyStore = create<AdminCompanyStore>((set) => ({
  companies: [],
  total: 0,
  page: 1,
  limit: 10,
  totalPages: 0,
  loading: false,
  error: null,

  fetchCompanies: async (page = 1, limit = 10) => {
    set({ loading: true, error: null });
    try {
      const result = await adminCompanyApi.getAll(page, limit);
      set({
        companies: result.data,
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
        loading: false,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch companies';
      set({ error: message, loading: false });
    }
  },

  updateCompanyStatus: async (companyId: string, status: string) => {
    set({ loading: true, error: null });
    try {
      const updated = await adminCompanyApi.updateStatus(companyId, { status: status as any });
      set((state) => ({
        companies: state.companies.map((c) => (c.id === companyId ? updated : c)),
        loading: false,
      }));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update company status';
      set({ error: message, loading: false });
      throw error;
    }
  },

  updateCompanyPlan: async (companyId: string, plan: string) => {
    set({ loading: true, error: null });
    try {
      const updated = await adminCompanyApi.updatePlan(companyId, { plan });
      set((state) => ({
        companies: state.companies.map((c) => (c.id === companyId ? updated : c)),
        loading: false,
      }));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update company plan';
      set({ error: message, loading: false });
      throw error;
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));
