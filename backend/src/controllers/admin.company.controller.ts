import { Response } from 'express';
import { AuthRequest } from '../types/auth.types';
import { AdminCompanyService, CompanyStatus } from '../services/admin.company.service';
import { AppError } from '../middleware/error.middleware';

export class AdminCompanyController {
  /**
   * Get all companies
   */
  static async getAllCompanies(req: AuthRequest, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await AdminCompanyService.getAllCompanies(page, limit);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch companies';
      res.status(500).json({
        success: false,
        error: message,
      });
    }
  }

  /**
   * Get company detail
   */
  static async getCompanyDetail(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { companyId } = req.params;

      if (!companyId) {
        res.status(400).json({
          success: false,
          error: 'Company ID is required',
        });
        return;
      }

      const company = await AdminCompanyService.getCompanyDetail(companyId);

      res.status(200).json({
        success: true,
        data: company,
      });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          success: false,
          error: error.message,
        });
        return;
      }

      const message = error instanceof Error ? error.message : 'Failed to fetch company';
      res.status(500).json({
        success: false,
        error: message,
      });
    }
  }

  /**
   * Update company status
   */
  static async updateCompanyStatus(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { companyId } = req.params;
      const { status } = req.body;

      if (!companyId) {
        res.status(400).json({
          success: false,
          error: 'Company ID is required',
        });
        return;
      }

      if (!status) {
        res.status(400).json({
          success: false,
          error: 'Status is required',
        });
        return;
      }

      const validStatuses: CompanyStatus[] = ['pending', 'approved', 'rejected', 'suspended'];
      if (!validStatuses.includes(status)) {
        res.status(400).json({
          success: false,
          error: `Status must be one of: ${validStatuses.join(', ')}`,
        });
        return;
      }

      if (!req.user?.userId) {
        res.status(401).json({
          success: false,
          error: 'Unauthorized',
        });
        return;
      }

      const company = await AdminCompanyService.updateCompanyStatus(
        companyId,
        status,
        req.user.userId
      );

      res.status(200).json({
        success: true,
        data: company,
      });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          success: false,
          error: error.message,
        });
        return;
      }

      const message = error instanceof Error ? error.message : 'Failed to update company status';
      res.status(500).json({
        success: false,
        error: message,
      });
    }
  }

  /**
   * Update company plan
   */
  static async updateCompanyPlan(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { companyId } = req.params;
      const { plan } = req.body;

      if (!companyId) {
        res.status(400).json({
          success: false,
          error: 'Company ID is required',
        });
        return;
      }

      if (!plan) {
        res.status(400).json({
          success: false,
          error: 'Plan is required',
        });
        return;
      }

      const company = await AdminCompanyService.updateCompanyPlan(companyId, plan);

      res.status(200).json({
        success: true,
        data: company,
      });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          success: false,
          error: error.message,
        });
        return;
      }

      const message = error instanceof Error ? error.message : 'Failed to update company plan';
      res.status(500).json({
        success: false,
        error: message,
      });
    }
  }
}
