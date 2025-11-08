import { Router } from 'express';
import multer from 'multer';
import { CompanyController } from '../controllers/company.controller';
import { authenticate, requireCompanyUser, requireApprovedCompany } from '../middleware/auth.middleware';

const router = Router();

// Configure multer for file uploads (memory storage for ImageKit)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    // Only allow image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

// All routes require authentication, company user, and approved company
router.use(authenticate);
router.use(requireCompanyUser);
router.use(requireApprovedCompany);

/**
 * GET /api/company/profile
 * Get company profile
 */
router.get('/profile', CompanyController.getProfile);

/**
 * PUT /api/company/profile
 * Update company profile
 */
router.put('/profile', CompanyController.updateProfile);

/**
 * POST /api/company/logo
 * Upload company logo
 */
router.post('/logo', upload.single('logo'), CompanyController.uploadLogo);

export default router;
