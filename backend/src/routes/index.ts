import { Router } from 'express';
import platformAdminRoutes from './platformAdmin.routes';
import authRoutes from './auth.routes';
import companyRoutes from './company.routes';
import customerRoutes from './customer.routes';
import productRoutes from './product.routes';

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

/**
 * Customer Routes
 * GET /api/customers
 * GET /api/customers/:id
 * POST /api/customers
 * PUT /api/customers/:id
 * DELETE /api/customers/:id
 */
router.use('/customers', customerRoutes);

/**
 * Product Routes
 * GET /api/products
 * GET /api/products/:id
 * POST /api/products
 * PUT /api/products/:id
 * DELETE /api/products/:id
 */
router.use('/products', productRoutes);

export default router;
