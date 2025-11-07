import { prisma } from '../server';
import { PlatformAdminUser } from '../types/auth.types';
import { hashPassword, comparePassword } from '../utils/password.util';
import { AppError } from '../middleware/error.middleware';

/**
 * Platform Admin Service
 * Handles platform admin authentication
 */
export class PlatformAdminService {
  /**
   * Authenticate platform admin with email and password
   */
  static async authenticatePlatformAdmin(email: string, password: string): Promise<PlatformAdminUser> {
    try {
      // Find platform admin by email
      const admin = await prisma.platformAdmin.findUnique({
        where: { email },
      });

      if (!admin) {
        throw new AppError('Invalid email or password', 401);
      }

      // Verify password
      const isPasswordValid = await comparePassword(password, admin.passwordHash);

      if (!isPasswordValid) {
        throw new AppError('Invalid email or password', 401);
      }

      // Check if admin is active
      if (!admin.isActive) {
        throw new AppError('This admin account has been deactivated', 403);
      }

      // Return admin user (without password hash)
      return {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Authentication failed', 500);
    }
  }

  /**
   * Get platform admin by ID
   */
  static async getPlatformAdminById(id: string): Promise<PlatformAdminUser | null> {
    try {
      const admin = await prisma.platformAdmin.findUnique({
        where: { id },
      });

      if (!admin) {
        return null;
      }

      return {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      };
    } catch (error) {
      throw new AppError('Failed to retrieve admin', 500);
    }
  }

  /**
   * Get platform admin by email
   */
  static async getPlatformAdminByEmail(email: string): Promise<PlatformAdminUser | null> {
    try {
      const admin = await prisma.platformAdmin.findUnique({
        where: { email },
      });

      if (!admin) {
        return null;
      }

      return {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      };
    } catch (error) {
      throw new AppError('Failed to retrieve admin', 500);
    }
  }

  /**
   * Create a new platform admin (for initial setup)
   * Should only be called in development or by another admin
   */
  static async createPlatformAdmin(
    name: string,
    email: string,
    password: string,
    role: 'super_admin' | 'support' = 'super_admin'
  ): Promise<PlatformAdminUser> {
    try {
      // Check if admin already exists
      const existingAdmin = await prisma.platformAdmin.findUnique({
        where: { email },
      });

      if (existingAdmin) {
        throw new AppError('Admin with this email already exists', 409);
      }

      // Hash password
      const passwordHash = await hashPassword(password);

      // Create admin
      const admin = await prisma.platformAdmin.create({
        data: {
          name,
          email,
          passwordHash,
          role,
          isActive: true,
        },
      });

      return {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to create admin', 500);
    }
  }
}
