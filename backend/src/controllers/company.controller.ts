import { Response } from 'express';
import { CompanyService, UpdateCompanyProfileInput } from '../services/company.service';
import { updateCompanyProfileSchema } from '../utils/validation.util';
import { AppError } from '../middleware/error.middleware';
import { AuthRequest } from '../types/auth.types';

export class CompanyController {
  /**
   * Get company profile
   * GET /api/company/profile
   */
  static async getProfile(req: AuthRequest, res: Response) {
    try {
      const companyId = req.user?.companyId;
      if (!companyId) {
        throw new AppError('Company ID not found in token', 401);
      }

      const profile = await CompanyService.getProfile(companyId);
      res.json({
        success: true,
        data: profile,
      });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          success: false,
          error: error.message,
        });
      } else {
        const message = error instanceof Error ? error.message : 'Failed to retrieve company profile';
        res.status(500).json({
          success: false,
          error: message,
        });
      }
    }
  }

  /**
   * Update company profile
   * PUT /api/company/profile
   */
  static async updateProfile(req: AuthRequest, res: Response) {
    try {
      const companyId = req.user?.companyId;
      if (!companyId) {
        throw new AppError('Company ID not found in token', 401);
      }

      // Validate request body
      const validatedData = updateCompanyProfileSchema.parse(req.body);

      const updated = await CompanyService.updateProfile(companyId, validatedData);
      res.json({
        success: true,
        data: updated,
      });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          success: false,
          error: error.message,
        });
      } else {
        const message = error instanceof Error ? error.message : 'Failed to update company profile';
        res.status(400).json({
          success: false,
          error: message,
        });
      }
    }
  }

  /**
   * Upload company logo
   * POST /api/company/logo
   */
  static async uploadLogo(req: AuthRequest, res: Response) {
    try {
      const companyId = req.user?.companyId;
      if (!companyId) {
        throw new AppError('Company ID not found in token', 401);
      }

      if (!req.file) {
        throw new AppError('No file provided', 400);
      }

      const result = await CompanyService.uploadLogo(
        companyId,
        req.file.buffer,
        req.file.originalname
      );

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          success: false,
          error: error.message,
        });
      } else {
        const message = error instanceof Error ? error.message : 'Failed to upload logo';
        res.status(500).json({
          success: false,
          error: message,
        });
      }
    }
  }
}
