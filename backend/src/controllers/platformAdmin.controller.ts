import { Response } from 'express';
import { AuthRequest, LoginDTO, TokenResponse, AdminLoginResponse } from '../types/auth.types';
import { PlatformAdminService } from '../services/platformAdmin.service';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt.util';
import { AppError, asyncHandler } from '../middleware/error.middleware';

/**
 * Platform Admin Controller
 */
export class PlatformAdminController {
  /**
   * Login endpoint for platform admins
   */
  static login = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { email, password } = req.body as LoginDTO;

    // Authenticate admin
    const admin = await PlatformAdminService.authenticatePlatformAdmin(email, password);

    // Generate tokens
    const accessToken = generateAccessToken({
      userId: admin.id,
      email: admin.email,
      userType: 'platform_admin',
      role: admin.role,
    });

    const refreshToken = generateRefreshToken({
      userId: admin.id,
      userType: 'platform_admin',
    });

    // Send response
    res.status(200).json({
      success: true,
      data: {
        user: admin,
        accessToken,
        refreshToken,
      } as AdminLoginResponse,
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

    // Get admin info
    const admin = await PlatformAdminService.getPlatformAdminById(req.user!.userId);

    if (!admin) {
      throw new AppError('Admin not found', 404);
    }

    // Generate new tokens
    const newAccessToken = generateAccessToken({
      userId: admin.id,
      email: admin.email,
      userType: 'platform_admin',
      role: admin.role,
    });

    const newRefreshToken = generateRefreshToken({
      userId: admin.id,
      userType: 'platform_admin',
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
   * Get current admin info
   */
  static getMe = asyncHandler(async (req: AuthRequest, res: Response) => {
    const admin = await PlatformAdminService.getPlatformAdminById(req.user!.userId);

    if (!admin) {
      throw new AppError('Admin not found', 404);
    }

    res.status(200).json({
      success: true,
      data: {
        user: admin,
      },
    });
  });
}
