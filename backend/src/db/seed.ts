import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../utils/password.util';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  try {
    // Delete existing data (for fresh seed)
    console.log('Clearing existing data...');
    await prisma.user.deleteMany();
    await prisma.platformAdmin.deleteMany();
    await prisma.company.deleteMany();

    // Create Platform Admin
    console.log('Creating platform admin...');
    const passwordHash = await hashPassword('admin123');

    const admin = await prisma.platformAdmin.create({
      data: {
        name: 'Admin User',
        email: 'admin@techverin.com',
        passwordHash,
        role: 'super_admin',
        isActive: true,
      },
    });

    console.log('✓ Platform admin created');
    console.log('  Email: admin@techverin.com');
    console.log('  Password: admin123');

    // Create Approved Pro Company
    console.log('\nCreating approved Pro company...');
    const proCompany = await prisma.company.create({
      data: {
        name: 'Demo Pro Company',
        email: 'demo@company.com',
        phone: '+1234567890',
        website: 'https://democompany.com',
        gstTinNumber: 'GST123456789',
        defaultCurrencyCode: 'USD',
        status: 'approved',
        plan: 'pro',
        approvedById: admin.id,
        approvedAt: new Date(),
        headerNote: 'Thank you for your business',
        footerNote: 'Payment Terms: Net 30',
        defaultTerms: 'Payment due within 30 days',
      },
    });

    // Create user for Pro company
    const proUserPasswordHash = await hashPassword('Demo123!');
    const proUser = await prisma.user.create({
      data: {
        companyId: proCompany.id,
        name: 'Demo User (Pro)',
        email: 'user@democompany.com',
        passwordHash: proUserPasswordHash,
        role: 'admin',
        isActive: true,
        emailVerified: true,
      },
    });

    // Create sequence for Pro company
    await prisma.sequence.create({
      data: {
        companyId: proCompany.id,
        invoicePrefix: 'INV',
        quotationPrefix: 'QT',
      },
    });

    console.log('✓ Approved Pro company created');
    console.log('  Company Email: demo@company.com');
    console.log('  User Email: user@democompany.com');
    console.log('  Password: Demo123!');
    console.log('  Status: APPROVED');
    console.log('  Plan: PRO');

    // Create Pending Starter Company
    console.log('\nCreating pending Starter company...');
    const starterCompany = await prisma.company.create({
      data: {
        name: 'Pending Starter Company',
        email: 'pending@company.com',
        phone: '+9876543210',
        website: 'https://pendingcompany.com',
        gstTinNumber: 'GST987654321',
        defaultCurrencyCode: 'USD',
        status: 'pending',
        plan: 'starter',
        headerNote: 'Waiting for approval',
        footerNote: 'This is a pending company',
      },
    });

    // Create user for Starter company
    const starterUserPasswordHash = await hashPassword('Pending123!');
    const starterUser = await prisma.user.create({
      data: {
        companyId: starterCompany.id,
        name: 'Pending User (Starter)',
        email: 'user@pendingcompany.com',
        passwordHash: starterUserPasswordHash,
        role: 'admin',
        isActive: true,
        emailVerified: false,
      },
    });

    // Create sequence for Starter company
    await prisma.sequence.create({
      data: {
        companyId: starterCompany.id,
        invoicePrefix: 'INV',
        quotationPrefix: 'QT',
      },
    });

    console.log('✓ Pending Starter company created');
    console.log('  Company Email: pending@company.com');
    console.log('  User Email: user@pendingcompany.com');
    console.log('  Password: Pending123!');
    console.log('  Status: PENDING (waiting for approval)');
    console.log('  Plan: STARTER');

    console.log('\n✅ Database seeded successfully!\n');
    console.log('Test Credentials:');
    console.log('==================');
    console.log('\nPlatform Admin:');
    console.log('  Email: admin@techverin.com');
    console.log('  Password: admin123');
    console.log('\nApproved Pro Company User:');
    console.log('  Email: user@democompany.com');
    console.log('  Password: Demo123!');
    console.log('\nPending Starter Company User:');
    console.log('  Email: user@pendingcompany.com');
    console.log('  Password: Pending123!');
    console.log('  Status: PENDING (not approved yet)');
    console.log('==================\n');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
