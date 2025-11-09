import { Response } from 'express';
import { CustomerService } from '../services/customer.service';
import { createCustomerSchema, updateCustomerSchema } from '../utils/validation.util';
import { AppError } from '../middleware/error.middleware';
import { AuthRequest } from '../types/auth.types';

export class CustomerController {
  /**
   * Get all customers
   * GET /api/customers
   */
  static async getAll(req: AuthRequest, res: Response) {
    try {
      const companyId = req.user?.companyId;
      if (!companyId) {
        throw new AppError('Company ID not found in token', 401);
      }

      const customers = await CustomerService.getAll(companyId);
      res.json({
        success: true,
        data: customers,
      });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          success: false,
          error: error.message,
        });
      } else {
        const message = error instanceof Error ? error.message : 'Failed to fetch customers';
        res.status(500).json({
          success: false,
          error: message,
        });
      }
    }
  }

  /**
   * Get customer by ID
   * GET /api/customers/:id
   */
  static async getById(req: AuthRequest, res: Response) {
    try {
      const companyId = req.user?.companyId;
      if (!companyId) {
        throw new AppError('Company ID not found in token', 401);
      }

      const customer = await CustomerService.getById(companyId, req.params.id);
      res.json({
        success: true,
        data: customer,
      });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          success: false,
          error: error.message,
        });
      } else {
        const message = error instanceof Error ? error.message : 'Failed to fetch customer';
        res.status(500).json({
          success: false,
          error: message,
        });
      }
    }
  }

  /**
   * Create a new customer
   * POST /api/customers
   */
  static async create(req: AuthRequest, res: Response) {
    try {
      const companyId = req.user?.companyId;
      if (!companyId) {
        throw new AppError('Company ID not found in token', 401);
      }

      const validatedData = createCustomerSchema.parse(req.body);
      const customer = await CustomerService.create(companyId, validatedData);

      res.status(201).json({
        success: true,
        data: customer,
      });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          success: false,
          error: error.message,
        });
      } else {
        const message = error instanceof Error ? error.message : 'Failed to create customer';
        res.status(400).json({
          success: false,
          error: message,
        });
      }
    }
  }

  /**
   * Update a customer
   * PUT /api/customers/:id
   */
  static async update(req: AuthRequest, res: Response) {
    try {
      const companyId = req.user?.companyId;
      if (!companyId) {
        throw new AppError('Company ID not found in token', 401);
      }

      const validatedData = updateCustomerSchema.parse(req.body);
      const customer = await CustomerService.update(companyId, req.params.id, validatedData);

      res.json({
        success: true,
        data: customer,
      });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          success: false,
          error: error.message,
        });
      } else {
        const message = error instanceof Error ? error.message : 'Failed to update customer';
        res.status(400).json({
          success: false,
          error: message,
        });
      }
    }
  }

  /**
   * Delete a customer
   * DELETE /api/customers/:id
   */
  static async delete(req: AuthRequest, res: Response) {
    try {
      const companyId = req.user?.companyId;
      if (!companyId) {
        throw new AppError('Company ID not found in token', 401);
      }

      await CustomerService.delete(companyId, req.params.id);

      res.json({
        success: true,
        data: { id: req.params.id },
      });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          success: false,
          error: error.message,
        });
      } else {
        const message = error instanceof Error ? error.message : 'Failed to delete customer';
        res.status(500).json({
          success: false,
          error: message,
        });
      }
    }
  }
}
