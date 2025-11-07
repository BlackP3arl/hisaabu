import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authenticate, requireCompanyUser, requireApprovedCompany } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';
import { loginSchema, refreshTokenSchema, registerCompanySchema } from '../utils/validation.util';

const router = Router();

/**
 * POST /api/auth/register-company
 * Register a new company
 */
router.post('/register-company', validate(registerCompanySchema), AuthController.registerCompany);

/**
 * POST /api/auth/login
 * Login for company users
 */
router.post('/login', validate(loginSchema), AuthController.login);

/**
 * POST /api/auth/refresh
 * Refresh access token
 */
router.post('/refresh', validate(refreshTokenSchema), AuthController.refresh);

/**
 * POST /api/auth/logout
 * Logout (frontend clears tokens)
 */
router.post('/logout', authenticate, requireCompanyUser, AuthController.logout);

/**
 * GET /api/auth/me
 * Get current company user info
 */
router.get('/me', authenticate, requireCompanyUser, AuthController.getMe);

export default router;
