import { prisma } from '../server';
import { CompanyUser, CompanyData, RegisterCompanyDTO } from '../types/auth.types';
import { hashPassword, comparePassword } from '../utils/password.util';
import { AppError } from '../middleware/error.middleware';

/**
 * Auth Service
 * Handles company registration and user authentication
 */
export class AuthService {
  /**
   * Register a new company with initial user
   */
  static async registerCompany(data: RegisterCompanyDTO): Promise<{ companyId: string; userId: string }> {
    try {
      // Check if company email already exists
      const existingCompany = await prisma.company.findUnique({
        where: { email: data.company.email },
      });

      if (existingCompany) {
        throw new AppError('A company with this email already exists', 409);
      }

      // Hash password
      const passwordHash = await hashPassword(data.user.password);

      // Create company with user in transaction
      const result = await prisma.$transaction(async (tx) => {
        // Create company (pending status)
        const company = await tx.company.create({
          data: {
            name: data.company.name,
            email: data.company.email,
            phone: data.company.phone,
            gstTinNumber: data.company.gstTinNumber,
            defaultCurrencyCode: data.company.defaultCurrencyCode,
            status: 'pending',
            plan: 'starter',
          },
        });

        // Create first user for company (admin role)
        const user = await tx.user.create({
          data: {
            companyId: company.id,
            name: data.user.name,
            email: data.user.email,
            passwordHash,
            role: 'admin',
            isActive: true,
            emailVerified: false,
          },
        });

        // Create sequence for document numbering
        await tx.sequence.create({
          data: {
            companyId: company.id,
          },
        });

        return { company, user };
      });

      return {
        companyId: result.company.id,
        userId: result.user.id,
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      console.error('Registration error:', error);
      throw new AppError('Failed to register company', 500);
    }
  }

  /**
   * Authenticate company user with email and password
   */
  static async authenticateUser(email: string, password: string): Promise<{ user: CompanyUser; company: CompanyData }> {
    try {
      // Find user by email
      const user = await prisma.user.findFirst({
        where: { email },
        include: { company: true },
      });

      if (!user) {
        throw new AppError('Invalid email or password', 401);
      }

      // Verify password
      const isPasswordValid = await comparePassword(password, user.passwordHash);

      if (!isPasswordValid) {
        throw new AppError('Invalid email or password', 401);
      }

      // Check if user is active
      if (!user.isActive) {
        throw new AppError('This user account has been deactivated', 403);
      }

      // Check company status
      if (user.company.status !== 'approved') {
        throw new AppError(`Your company is currently ${user.company.status}. Please wait for admin approval.`, 403);
      }

      return {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          companyId: user.companyId,
        },
        company: {
          id: user.company.id,
          name: user.company.name,
          status: user.company.status as 'pending' | 'approved' | 'suspended',
          plan: user.company.plan as 'starter' | 'pro',
        },
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Authentication failed', 500);
    }
  }

  /**
   * Get user by ID
   */
  static async getUserById(id: string): Promise<CompanyUser | null> {
    try {
      const user = await prisma.user.findUnique({
        where: { id },
      });

      if (!user) {
        return null;
      }

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        companyId: user.companyId,
      };
    } catch (error) {
      throw new AppError('Failed to retrieve user', 500);
    }
  }

  /**
   * Get user with company info
   */
  static async getUserWithCompany(id: string): Promise<{ user: CompanyUser; company: CompanyData } | null> {
    try {
      const user = await prisma.user.findUnique({
        where: { id },
        include: { company: true },
      });

      if (!user) {
        return null;
      }

      return {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          companyId: user.companyId,
        },
        company: {
          id: user.company.id,
          name: user.company.name,
          status: user.company.status as 'pending' | 'approved' | 'suspended',
          plan: user.company.plan as 'starter' | 'pro',
        },
      };
    } catch (error) {
      throw new AppError('Failed to retrieve user', 500);
    }
  }

  /**
   * Check if company email exists
   */
  static async checkCompanyEmailExists(email: string): Promise<boolean> {
    try {
      const company = await prisma.company.findUnique({
        where: { email },
      });

      return !!company;
    } catch (error) {
      throw new AppError('Failed to check company email', 500);
    }
  }

  /**
   * Check if user email exists in company
   */
  static async checkUserEmailExists(companyId: string, email: string): Promise<boolean> {
    try {
      const user = await prisma.user.findFirst({
        where: {
          companyId,
          email,
        },
      });

      return !!user;
    } catch (error) {
      throw new AppError('Failed to check user email', 500);
    }
  }
}
