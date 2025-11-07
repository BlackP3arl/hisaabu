import { Response } from 'express';
import { AuthRequest, LoginDTO, RegisterCompanyDTO, TokenResponse, UserLoginResponse, RegisterCompanyResponse } from '../types/auth.types';
import { AuthService } from '../services/auth.service';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt.util';
import { AppError, asyncHandler } from '../middleware/error.middleware';

/**
 * Auth Controller for Company Users
 */
export class AuthController {
  /**
   * Register a new company
   */
  static registerCompany = asyncHandler(async (req: AuthRequest, res: Response) => {
    const data = req.body as RegisterCompanyDTO;

    // Register company
    const result = await AuthService.registerCompany(data);

    res.status(201).json({
      success: true,
      message: 'Company registered successfully. Waiting for admin approval.',
      data: result as RegisterCompanyResponse,
    });
  });

  /**
   * Login endpoint for company users
   */
  static login = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { email, password } = req.body as LoginDTO;

    // Authenticate user
    const { user, company } = await AuthService.authenticateUser(email, password);

    // Generate tokens
    const accessToken = generateAccessToken({
      userId: user.id,
      email: user.email,
      userType: 'company_user',
      role: user.role,
      companyId: user.companyId,
      companyStatus: company.status,
    });

    const refreshToken = generateRefreshToken({
      userId: user.id,
      userType: 'company_user',
    });

    // Send response
    res.status(200).json({
      success: true,
      data: {
        user,
        company,
        accessToken,
        refreshToken,
      } as UserLoginResponse,
    });
  });

  /**
   * Refresh token endpoint
   */
  static refresh = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      throw new AppError('Refresh token is required', 400);
    }

    // Get user info with company
    const userWithCompany = await AuthService.getUserWithCompany(req.user!.userId);

    if (!userWithCompany) {
      throw new AppError('User not found', 404);
    }

    const { user, company } = userWithCompany;

    // Generate new tokens
    const newAccessToken = generateAccessToken({
      userId: user.id,
      email: user.email,
      userType: 'company_user',
      role: user.role,
      companyId: user.companyId,
      companyStatus: company.status,
    });

    const newRefreshToken = generateRefreshToken({
      userId: user.id,
      userType: 'company_user',
    });

    res.status(200).json({
      success: true,
      data: {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      } as TokenResponse,
    });
  });

  /**
   * Logout endpoint
   */
  static logout = asyncHandler(async (req: AuthRequest, res: Response) => {
    res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  });

  /**
   * Get current user info
   */
  static getMe = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userWithCompany = await AuthService.getUserWithCompany(req.user!.userId);

    if (!userWithCompany) {
      throw new AppError('User not found', 404);
    }

    res.status(200).json({
      success: true,
      data: userWithCompany,
    });
  });
}
