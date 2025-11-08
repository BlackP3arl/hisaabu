import { Router } from 'express';
import platformAdminRoutes from './platformAdmin.routes';
import authRoutes from './auth.routes';
import companyRoutes from './company.routes';

const router = Router();

/**
 * Platform Admin Routes
 * POST /api/admin/auth/login
 * POST /api/admin/auth/refresh
 * POST /api/admin/auth/logout
 * GET /api/admin/auth/me
 */
router.use('/admin/auth', platformAdminRoutes);

/**
 * Company User Routes
 * POST /api/auth/register-company
 * POST /api/auth/login
 * POST /api/auth/refresh
 * POST /api/auth/logout
 * GET /api/auth/me
 */
router.use('/auth', authRoutes);

/**
 * Company Profile Routes
 * GET /api/company/profile
 * PUT /api/company/profile
 * POST /api/company/logo
 */
router.use('/company', companyRoutes);

export default router;
