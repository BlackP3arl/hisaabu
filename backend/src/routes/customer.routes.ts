import { Router } from 'express';
import { authenticate, requireCompanyUser, requireApprovedCompany } from '../middleware/auth.middleware';
import { CustomerController } from '../controllers/customer.controller';

const router = Router();

// All routes require authentication and approved company status
router.use(authenticate, requireCompanyUser, requireApprovedCompany);

/**
 * GET /api/customers - Get all customers for the company
 */
router.get('/', CustomerController.getAll);

/**
 * GET /api/customers/:id - Get specific customer
 */
router.get('/:id', CustomerController.getById);

/**
 * POST /api/customers - Create new customer
 */
router.post('/', CustomerController.create);

/**
 * PUT /api/customers/:id - Update customer
 */
router.put('/:id', CustomerController.update);

/**
 * DELETE /api/customers/:id - Delete customer
 */
router.delete('/:id', CustomerController.delete);

export default router;
