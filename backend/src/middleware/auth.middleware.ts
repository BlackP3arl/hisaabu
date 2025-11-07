import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, extractTokenFromHeader } from '../utils/jwt.util';
import { AuthRequest, AccessTokenPayload } from '../types/auth.types';

/**
 * Authenticate middleware
 * Verifies JWT token and attaches user to request
 */
export const authenticate = (req: AuthRequest, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;
    const token = extractTokenFromHeader(authHeader);

    if (!token) {
      res.status(401).json({
        success: false,
        error: 'No token provided. Please include Authorization header with Bearer token.',
      });
      return;
    }

    const payload = verifyAccessToken(token);

    if (!payload) {
      res.status(401).json({
        success: false,
        error: 'Invalid or expired token. Please log in again.',
      });
      return;
    }

    req.user = payload;
    if (payload.companyId) {
      req.companyId = payload.companyId;
    }

    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Authentication error',
    });
  }
};

/**
 * Require platform admin
 */
export const requirePlatformAdmin = (req: AuthRequest, res: Response, next: NextFunction): void => {
  try {
    if (!req.user || req.user.userType !== 'platform_admin') {
      res.status(403).json({
        success: false,
        error: 'This action requires platform admin privileges.',
      });
      return;
    }

    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Authorization error',
    });
  }
};

/**
 * Require company user
 */
export const requireCompanyUser = (req: AuthRequest, res: Response, next: NextFunction): void => {
  try {
    if (!req.user || req.user.userType !== 'company_user') {
      res.status(403).json({
        success: false,
        error: 'This action requires company user access.',
      });
      return;
    }

    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Authorization error',
    });
  }
};

/**
 * Require approved company
 */
export const requireApprovedCompany = (req: AuthRequest, res: Response, next: NextFunction): void => {
  try {
    if (!req.user || req.user.companyStatus !== 'approved') {
      res.status(403).json({
        success: false,
        error: 'Your company must be approved to access this resource. Please wait for admin approval.',
      });
      return;
    }

    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Authorization error',
    });
  }
};

/**
 * Require specific role(s)
 */
export const requireRole = (allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    try {
      if (!req.user || !allowedRoles.includes(req.user.role)) {
        res.status(403).json({
          success: false,
          error: `This action requires one of these roles: ${allowedRoles.join(', ')}`,
        });
        return;
      }

      next();
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Authorization error',
      });
    }
  };
};

/**
 * Scope to company (for multi-tenancy)
 * Automatically adds companyId to requests for company users
 */
export const scopeToCompany = (req: AuthRequest, res: Response, next: NextFunction): void => {
  try {
    if (req.user && req.user.userType === 'company_user' && req.user.companyId) {
      req.companyId = req.user.companyId;
    }

    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Middleware error',
    });
  }
};
