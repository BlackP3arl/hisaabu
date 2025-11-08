import { prisma } from '../server';
import { uploadImage } from '../utils/imagekit.util';
import { updateCompanyProfileSchema } from '../utils/validation.util';
import { AppError } from '../middleware/error.middleware';
import { z } from 'zod';

export type UpdateCompanyProfileInput = z.infer<typeof updateCompanyProfileSchema>;

export class CompanyService {
  /**
   * Get company profile
   */
  static async getProfile(companyId: string) {
    const company = await prisma.company.findUnique({
      where: { id: companyId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        website: true,
        logoUrl: true,
        gstTinNumber: true,
        defaultCurrencyCode: true,
        headerNote: true,
        footerNote: true,
        defaultTerms: true,
        defaultInvoiceTerms: true,
        defaultQuotationTerms: true,
        address: true,
        socialLinks: true,
        bankAccounts: true,
        status: true,
        plan: true,
        createdAt: true,
      },
    });

    if (!company) {
      throw new AppError('Company not found', 404);
    }

    return company;
  }

  /**
   * Update company profile
   */
  static async updateProfile(companyId: string, data: UpdateCompanyProfileInput) {
    const company = await prisma.company.findUnique({
      where: { id: companyId },
    });

    if (!company) {
      throw new AppError('Company not found', 404);
    }

    const updateData: any = {};

    // Update simple string fields
    if (data.name) updateData.name = data.name;
    if (data.email) updateData.email = data.email;
    if (data.phone) updateData.phone = data.phone;
    if (data.website) updateData.website = data.website;
    if (data.gstTinNumber) updateData.gstTinNumber = data.gstTinNumber;
    if (data.defaultCurrencyCode) updateData.defaultCurrencyCode = data.defaultCurrencyCode;
    if (data.logoUrl !== undefined) updateData.logoUrl = data.logoUrl || null;
    if (data.headerNote !== undefined) updateData.headerNote = data.headerNote;
    if (data.footerNote !== undefined) updateData.footerNote = data.footerNote;
    if (data.defaultTerms !== undefined) updateData.defaultTerms = data.defaultTerms;
    if (data.defaultInvoiceTerms !== undefined) updateData.defaultInvoiceTerms = data.defaultInvoiceTerms;
    if (data.defaultQuotationTerms !== undefined) updateData.defaultQuotationTerms = data.defaultQuotationTerms;

    // Update JSON fields
    if (data.address) updateData.address = data.address;
    if (data.socialLinks) updateData.socialLinks = data.socialLinks;
    if (data.bankAccounts) updateData.bankAccounts = data.bankAccounts;

    const updated = await prisma.company.update({
      where: { id: companyId },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        website: true,
        logoUrl: true,
        gstTinNumber: true,
        defaultCurrencyCode: true,
        headerNote: true,
        footerNote: true,
        defaultTerms: true,
        defaultInvoiceTerms: true,
        defaultQuotationTerms: true,
        address: true,
        socialLinks: true,
        bankAccounts: true,
      },
    });

    return updated;
  }

  /**
   * Upload company logo
   */
  static async uploadLogo(companyId: string, file: Buffer, originalFileName: string) {
    const company = await prisma.company.findUnique({
      where: { id: companyId },
    });

    if (!company) {
      throw new AppError('Company not found', 404);
    }

    // Delete old logo if exists
    if (company.logoUrl) {
      try {
        // Extract fileId from URL if needed (simplified for now)
        // In production, you'd store the fileId separately
      } catch (error) {
        console.error('Error deleting old logo:', error);
      }
    }

    // Upload new logo
    const fileName = `${companyId}-${Date.now()}-${originalFileName}`;
    const { url } = await uploadImage(file, fileName, `logos`);

    // Update company with new logo URL
    const updated = await prisma.company.update({
      where: { id: companyId },
      data: { logoUrl: url },
      select: { logoUrl: true },
    });

    return updated;
  }
}
