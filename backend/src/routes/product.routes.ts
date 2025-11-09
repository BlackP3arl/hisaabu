import { Router } from 'express';
import { authenticate, requireCompanyUser, requireApprovedCompany } from '../middleware/auth.middleware';
import { ProductController } from '../controllers/product.controller';

const router = Router();

// All routes require authentication and approved company status
router.use(authenticate, requireCompanyUser, requireApprovedCompany);

/**
 * GET /api/products - Get all products for the company
 */
router.get('/', ProductController.getAll);

/**
 * GET /api/products/:id - Get specific product
 */
router.get('/:id', ProductController.getById);

/**
 * POST /api/products - Create new product
 */
router.post('/', ProductController.create);

/**
 * PUT /api/products/:id - Update product
 */
router.put('/:id', ProductController.update);

/**
 * DELETE /api/products/:id - Delete product
 */
router.delete('/:id', ProductController.delete);

export default router;
