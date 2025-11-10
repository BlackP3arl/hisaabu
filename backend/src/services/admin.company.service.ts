import { prisma } from '../server';
import { AppError } from '../middleware/error.middleware';

export type CompanyStatus = 'pending' | 'approved' | 'rejected' | 'suspended';

export class AdminCompanyService {
  /**
   * Get all companies with pagination
   */
  static async getAllCompanies(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [companies, total] = await Promise.all([
      prisma.company.findMany({
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          status: true,
          plan: true,
          createdAt: true,
          approvedAt: true,
          approvedById: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.company.count(),
    ]);

    return {
      data: companies,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Get company details
   */
  static async getCompanyDetail(companyId: string) {
    const company = await prisma.company.findUnique({
      where: { id: companyId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        website: true,
        gstTinNumber: true,
        status: true,
        plan: true,
        createdAt: true,
        approvedAt: true,
        approvedById: true,
      },
    });

    if (!company) {
      throw new AppError('Company not found', 404);
    }

    return company;
  }

  /**
   * Update company status
   */
  static async updateCompanyStatus(
    companyId: string,
    status: CompanyStatus,
    adminId: string
  ) {
    const company = await prisma.company.findUnique({
      where: { id: companyId },
    });

    if (!company) {
      throw new AppError('Company not found', 404);
    }

    const updateData: any = { status };

    // Set approved fields when approving
    if (status === 'approved') {
      updateData.approvedAt = new Date();
      updateData.approvedById = adminId;
    }
    // Clear approved fields for other statuses
    else if (status === 'pending' || status === 'rejected' || status === 'suspended') {
      updateData.approvedAt = null;
      updateData.approvedById = null;
    }

    return prisma.company.update({
      where: { id: companyId },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        status: true,
        plan: true,
        createdAt: true,
        approvedAt: true,
        approvedById: true,
      },
    });
  }

  /**
   * Update company plan
   */
  static async updateCompanyPlan(companyId: string, plan: string) {
    const company = await prisma.company.findUnique({
      where: { id: companyId },
    });

    if (!company) {
      throw new AppError('Company not found', 404);
    }

    const validPlans = ['starter', 'pro'];
    if (!validPlans.includes(plan)) {
      throw new AppError(`Plan must be one of: ${validPlans.join(', ')}`, 400);
    }

    return prisma.company.update({
      where: { id: companyId },
      data: { plan: plan as any },
      select: {
        id: true,
        name: true,
        email: true,
        status: true,
        plan: true,
        createdAt: true,
      },
    });
  }
}
