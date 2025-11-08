import { create } from 'zustand';
import { companyApi, CompanyProfile, UpdateCompanyProfileData } from '../api/company.api';

interface CompanyStore {
  profile: CompanyProfile | null;
  loading: boolean;
  error: string | null;

  // Actions
  fetchProfile: () => Promise<void>;
  updateProfile: (data: UpdateCompanyProfileData) => Promise<void>;
  uploadLogo: (file: File) => Promise<void>;
  setProfile: (profile: CompanyProfile) => void;
  clearError: () => void;
}

export const useCompanyStore = create<CompanyStore>((set) => ({
  profile: null,
  loading: false,
  error: null,

  fetchProfile: async () => {
    set({ loading: true, error: null });
    try {
      const profile = await companyApi.getProfile();
      set({ profile, loading: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch profile';
      set({ error: message, loading: false });
    }
  },

  updateProfile: async (data: UpdateCompanyProfileData) => {
    set({ loading: true, error: null });
    try {
      const updated = await companyApi.updateProfile(data);
      set({ profile: updated, loading: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update profile';
      set({ error: message, loading: false });
      throw error;
    }
  },

  uploadLogo: async (file: File) => {
    set({ loading: true, error: null });
    try {
      const { logoUrl } = await companyApi.uploadLogo(file);
      set((state) => ({
        profile: state.profile ? { ...state.profile, logoUrl } : null,
        loading: false,
      }));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to upload logo';
      set({ error: message, loading: false });
      throw error;
    }
  },

  setProfile: (profile: CompanyProfile) => {
    set({ profile });
  },

  clearError: () => {
    set({ error: null });
  },
}));
