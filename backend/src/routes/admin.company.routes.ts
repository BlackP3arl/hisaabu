import { Router } from 'express';
import { authenticate, requirePlatformAdmin } from '../middleware/auth.middleware';
import { AdminCompanyController } from '../controllers/admin.company.controller';

const router = Router();

// All routes require authentication and platform admin role
router.use(authenticate, requirePlatformAdmin);

/**
 * GET /api/admin/companies - Get all companies
 */
router.get('/', AdminCompanyController.getAllCompanies);

/**
 * GET /api/admin/companies/:companyId - Get company detail
 */
router.get('/:companyId', AdminCompanyController.getCompanyDetail);

/**
 * PUT /api/admin/companies/:companyId/status - Update company status
 */
router.put('/:companyId/status', AdminCompanyController.updateCompanyStatus);

/**
 * PUT /api/admin/companies/:companyId/plan - Update company plan
 */
router.put('/:companyId/plan', AdminCompanyController.updateCompanyPlan);

export default router;
