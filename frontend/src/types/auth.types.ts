/**
 * Frontend Authentication Types
 */

export interface PlatformAdmin {
  id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'support';
}

export interface CompanyInfo {
  id: string;
  name: string;
  status: 'pending' | 'approved' | 'suspended';
  plan: 'starter' | 'pro';
}

export interface CompanyUser {
  id: string;
  name: string;
  email: string;
  role: string;
  companyId: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AdminLoginResponse extends AuthTokens {
  user: PlatformAdmin;
}

export interface UserLoginResponse extends AuthTokens {
  user: CompanyUser;
  company: CompanyInfo;
}

export interface RegisterCompanyPayload {
  company: {
    name: string;
    email: string;
    phone: string;
    gstTinNumber: string;
    defaultCurrencyCode: string;
  };
  user: {
    name: string;
    email: string;
    password: string;
  };
}

export interface RegisterCompanyResponse {
  companyId: string;
  userId: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RefreshTokenPayload {
  refreshToken: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface AuthContextType {
  // State
  isAuthenticated: boolean;
  isLoading: boolean;
  userType: 'admin' | 'company' | null;
  admin: PlatformAdmin | null;
  user: CompanyUser | null;
  company: CompanyInfo | null;
  accessToken: string | null;
  refreshToken: string | null;

  // Actions
  loginAsAdmin: (email: string, password: string) => Promise<void>;
  registerCompany: (payload: RegisterCompanyPayload) => Promise<RegisterCompanyResponse>;
  loginAsCompanyUser: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshTokens: () => Promise<void>;
  getMe: () => Promise<void>;
}
