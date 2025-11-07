import { Router } from 'express';
import { PlatformAdminController } from '../controllers/platformAdmin.controller';
import { authenticate, requirePlatformAdmin } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';
import { loginSchema, refreshTokenSchema } from '../utils/validation.util';

const router = Router();

/**
 * POST /api/admin/auth/login
 * Login for platform admins
 */
router.post('/login', validate(loginSchema), PlatformAdminController.login);

/**
 * POST /api/admin/auth/refresh
 * Refresh access token
 */
router.post('/refresh', validate(refreshTokenSchema), PlatformAdminController.refresh);

/**
 * POST /api/admin/auth/logout
 * Logout (frontend clears tokens)
 */
router.post('/logout', authenticate, requirePlatformAdmin, PlatformAdminController.logout);

/**
 * GET /api/admin/auth/me
 * Get current platform admin info
 */
router.get('/me', authenticate, requirePlatformAdmin, PlatformAdminController.getMe);

export default router;
