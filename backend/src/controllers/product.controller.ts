import { Response } from 'express';
import { ProductService } from '../services/product.service';
import { createProductSchema, updateProductSchema } from '../utils/validation.util';
import { AppError } from '../middleware/error.middleware';
import { AuthRequest } from '../types/auth.types';

export class ProductController {
  /**
   * Get all products
   * GET /api/products
   */
  static async getAll(req: AuthRequest, res: Response) {
    try {
      const companyId = req.user?.companyId;
      if (!companyId) {
        throw new AppError('Company ID not found in token', 401);
      }

      const products = await ProductService.getAll(companyId);
      res.json({
        success: true,
        data: products,
      });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          success: false,
          error: error.message,
        });
      } else {
        const message = error instanceof Error ? error.message : 'Failed to fetch products';
        res.status(500).json({
          success: false,
          error: message,
        });
      }
    }
  }

  /**
   * Get product by ID
   * GET /api/products/:id
   */
  static async getById(req: AuthRequest, res: Response) {
    try {
      const companyId = req.user?.companyId;
      if (!companyId) {
        throw new AppError('Company ID not found in token', 401);
      }

      const product = await ProductService.getById(companyId, req.params.id);
      res.json({
        success: true,
        data: product,
      });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          success: false,
          error: error.message,
        });
      } else {
        const message = error instanceof Error ? error.message : 'Failed to fetch product';
        res.status(500).json({
          success: false,
          error: message,
        });
      }
    }
  }

  /**
   * Create a new product
   * POST /api/products
   */
  static async create(req: AuthRequest, res: Response) {
    try {
      const companyId = req.user?.companyId;
      if (!companyId) {
        throw new AppError('Company ID not found in token', 401);
      }

      const validatedData = createProductSchema.parse(req.body);
      const product = await ProductService.create(companyId, validatedData);

      res.status(201).json({
        success: true,
        data: product,
      });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          success: false,
          error: error.message,
        });
      } else {
        const message = error instanceof Error ? error.message : 'Failed to create product';
        res.status(400).json({
          success: false,
          error: message,
        });
      }
    }
  }

  /**
   * Update a product
   * PUT /api/products/:id
   */
  static async update(req: AuthRequest, res: Response) {
    try {
      const companyId = req.user?.companyId;
      if (!companyId) {
        throw new AppError('Company ID not found in token', 401);
      }

      const validatedData = updateProductSchema.parse(req.body);
      const product = await ProductService.update(companyId, req.params.id, validatedData);

      res.json({
        success: true,
        data: product,
      });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          success: false,
          error: error.message,
        });
      } else {
        const message = error instanceof Error ? error.message : 'Failed to update product';
        res.status(400).json({
          success: false,
          error: message,
        });
      }
    }
  }

  /**
   * Delete a product
   * DELETE /api/products/:id
   */
  static async delete(req: AuthRequest, res: Response) {
    try {
      const companyId = req.user?.companyId;
      if (!companyId) {
        throw new AppError('Company ID not found in token', 401);
      }

      await ProductService.delete(companyId, req.params.id);

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
        const message = error instanceof Error ? error.message : 'Failed to delete product';
        res.status(500).json({
          success: false,
          error: message,
        });
      }
    }
  }
}
