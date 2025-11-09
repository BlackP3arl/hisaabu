import { prisma } from '../server';
import { CreateProductInput, UpdateProductInput } from '../utils/validation.util';
import { AppError } from '../middleware/error.middleware';
import { Decimal } from '@prisma/client/runtime/library';

export class ProductService {
  /**
   * Get all products for a company
   */
  static async getAll(companyId: string) {
    return prisma.product.findMany({
      where: { companyId },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Get product by ID
   */
  static async getById(companyId: string, productId: string) {
    const product = await prisma.product.findFirst({
      where: { id: productId, companyId },
    });

    if (!product) {
      throw new AppError('Product not found', 404);
    }

    return product;
  }

  /**
   * Create a new product
   */
  static async create(companyId: string, data: CreateProductInput) {
    // Check if SKU is unique within company (if provided)
    if (data.sku) {
      const existing = await prisma.product.findFirst({
        where: { companyId, sku: data.sku },
      });
      if (existing) {
        throw new AppError('SKU already exists for this company', 400);
      }
    }

    return prisma.product.create({
      data: {
        ...data,
        companyId,
        unitPrice: new Decimal(String(data.unitPrice)),
        taxRate: data.taxRate ? new Decimal(String(data.taxRate)) : new Decimal(0),
      },
    });
  }

  /**
   * Update a product
   */
  static async update(companyId: string, productId: string, data: UpdateProductInput) {
    const product = await prisma.product.findFirst({
      where: { id: productId, companyId },
    });

    if (!product) {
      throw new AppError('Product not found', 404);
    }

    // Check if new SKU is unique (if changing SKU)
    if (data.sku && data.sku !== product.sku) {
      const existing = await prisma.product.findFirst({
        where: { companyId, sku: data.sku },
      });
      if (existing) {
        throw new AppError('SKU already exists for this company', 400);
      }
    }

    const updateData: any = { ...data };
    if (data.unitPrice !== undefined) {
      updateData.unitPrice = new Decimal(String(data.unitPrice));
    }
    if (data.taxRate !== undefined) {
      updateData.taxRate = new Decimal(String(data.taxRate));
    }

    return prisma.product.update({
      where: { id: productId },
      data: updateData,
    });
  }

  /**
   * Delete a product
   */
  static async delete(companyId: string, productId: string) {
    const product = await prisma.product.findFirst({
      where: { id: productId, companyId },
    });

    if (!product) {
      throw new AppError('Product not found', 404);
    }

    return prisma.product.delete({
      where: { id: productId },
    });
  }
}
