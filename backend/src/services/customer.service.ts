import { prisma } from '../server';
import { CreateCustomerInput, UpdateCustomerInput } from '../utils/validation.util';
import { AppError } from '../middleware/error.middleware';

export class CustomerService {
  /**
   * Get all customers for a company
   */
  static async getAll(companyId: string) {
    return prisma.customer.findMany({
      where: { companyId },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Get customer by ID
   */
  static async getById(companyId: string, customerId: string) {
    const customer = await prisma.customer.findFirst({
      where: { id: customerId, companyId },
    });

    if (!customer) {
      throw new AppError('Customer not found', 404);
    }

    return customer;
  }

  /**
   * Create a new customer
   */
  static async create(companyId: string, data: CreateCustomerInput) {
    // Check if email is unique within company (if provided)
    if (data.email) {
      const existing = await prisma.customer.findFirst({
        where: { companyId, email: data.email },
      });
      if (existing) {
        throw new AppError('Email already exists for this company', 400);
      }
    }

    return prisma.customer.create({
      data: {
        ...data,
        companyId,
        address: data.address,
      },
    });
  }

  /**
   * Update a customer
   */
  static async update(companyId: string, customerId: string, data: UpdateCustomerInput) {
    const customer = await prisma.customer.findFirst({
      where: { id: customerId, companyId },
    });

    if (!customer) {
      throw new AppError('Customer not found', 404);
    }

    // Check if new email is unique (if changing email)
    if (data.email && data.email !== customer.email) {
      const existing = await prisma.customer.findFirst({
        where: { companyId, email: data.email },
      });
      if (existing) {
        throw new AppError('Email already exists for this company', 400);
      }
    }

    const updateData: any = { ...data };
    // Only update address if explicitly provided
    if (data.address !== undefined) {
      updateData.address = data.address;
    } else {
      // Keep existing address, exclude from update
      delete updateData.address;
    }

    return prisma.customer.update({
      where: { id: customerId },
      data: updateData,
    });
  }

  /**
   * Delete a customer
   */
  static async delete(companyId: string, customerId: string) {
    const customer = await prisma.customer.findFirst({
      where: { id: customerId, companyId },
    });

    if (!customer) {
      throw new AppError('Customer not found', 404);
    }

    return prisma.customer.delete({
      where: { id: customerId },
    });
  }
}
