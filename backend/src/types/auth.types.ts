import { Request } from 'express';
import { UserRole, PlatformAdminRole } from '@prisma/client';
import { Express } from 'express-serve-static-core';

/**
 * JWT Token Types
 */
export type UserType = 'platform_admin' | 'company_user';

export interface AccessTokenPayload {
  userId: string;
  email: string;
  userType: UserType;
  role: string;
  companyId?: string;
  companyStatus?: string;
  iat?: number;
  exp?: number;
}

export interface RefreshTokenPayload {
  userId: string;
  userType: UserType;
  iat?: number;
  exp?: number;
}

/**
 * User Types
 */
export interface PlatformAdminUser {
  id: string;
  name: string;
  email: string;
  role: PlatformAdminRole;
}

export interface CompanyUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  companyId: string;
}

export interface CompanyData {
  id: string;
  name: string;
  status: 'pending' | 'approved' | 'suspended';
  plan: 'starter' | 'pro';
}

/**
 * Request/Response Types
 */
export interface AuthRequest extends Request {
  user?: AccessTokenPayload;
  companyId?: string;
  file?: Express.Multer.File;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  data?: any;
  error?: string;
}

/**
 * Login/Register DTOs
 */
export interface LoginDTO {
  email: string;
  password: string;
}

export interface RegisterCompanyDTO {
  company: {
    name: string;
    email: string;
    phone?: string;
    gstTinNumber?: string;
    defaultCurrencyCode: string;
  };
  user: {
    name: string;
    email: string;
    password: string;
  };
}

export interface RefreshTokenDTO {
  refreshToken: string;
}

/**
 * Auth Response Payloads
 */
export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}

export interface AdminLoginResponse extends TokenResponse {
  user: PlatformAdminUser;
}

export interface UserLoginResponse extends TokenResponse {
  user: CompanyUser;
  company: CompanyData;
}

export interface RegisterCompanyResponse {
  companyId: string;
  userId: string;
}
