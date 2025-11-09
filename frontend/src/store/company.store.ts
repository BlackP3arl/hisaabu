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
      // Add cache-busting to logoUrl if it exists
      if (profile.logoUrl) {
        profile.logoUrl = `${profile.logoUrl}?t=${Date.now()}`;
      }
      set({ profile, loading: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch profile';
      set({ error: message, loading: false });
    }
  },

  updateProfile: async (data: UpdateCompanyProfileData) => {
    set({ loading: true, error: null });
    try {
      console.log('Store: Calling updateProfile API with data:', data);
      const updated = await companyApi.updateProfile(data);
      console.log('Store: Received updated profile:', updated);
      // Add cache-busting to logoUrl if it exists
      if (updated.logoUrl) {
        updated.logoUrl = `${updated.logoUrl}?t=${Date.now()}`;
      }
      set({ profile: updated, loading: false });
      console.log('Store: Profile state updated');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update profile';
      console.error('Store: Update failed:', error);
      set({ error: message, loading: false });
      throw error;
    }
  },

  uploadLogo: async (file: File) => {
    set({ loading: true, error: null });
    try {
      const { logoUrl } = await companyApi.uploadLogo(file);
      // Add cache-busting query parameter
      const urlWithCache = `${logoUrl}?t=${Date.now()}`;
      set((state) => ({
        profile: state.profile ? { ...state.profile, logoUrl: urlWithCache } : null,
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
