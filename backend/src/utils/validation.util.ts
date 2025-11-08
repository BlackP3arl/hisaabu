import { z } from 'zod';
import { validatePasswordStrength } from './password.util';

/**
 * Password validation schema
 */
const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .refine(
    (password) => /[A-Z]/.test(password),
    'Password must contain at least one uppercase letter'
  )
  .refine(
    (password) => /[a-z]/.test(password),
    'Password must contain at least one lowercase letter'
  )
  .refine(
    (password) => /[0-9]/.test(password),
    'Password must contain at least one number'
  );

/**
 * Email validation schema
 */
const emailSchema = z.string().email('Invalid email address');

/**
 * Login validation schema
 */
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

export type LoginInput = z.infer<typeof loginSchema>;

/**
 * Refresh token validation schema
 */
export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;

/**
 * Company registration schema
 */
export const registerCompanySchema = z.object({
  company: z.object({
    name: z.string().min(2, 'Company name must be at least 2 characters').max(100),
    email: emailSchema,
    phone: z.string().optional(),
    gstTinNumber: z.string().optional(),
    defaultCurrencyCode: z.string().length(3, 'Currency code must be 3 characters (e.g., USD)'),
  }),
  user: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(100),
    email: emailSchema,
    password: passwordSchema,
  }),
});

export type RegisterCompanyInput = z.infer<typeof registerCompanySchema>;

/**
 * Password reset schema
 */
export const passwordResetSchema = z.object({
  oldPassword: z.string().min(1, 'Old password is required'),
  newPassword: passwordSchema,
  confirmPassword: z.string().min(1, 'Password confirmation is required'),
}).refine(
  (data) => data.newPassword === data.confirmPassword,
  {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  }
);

export type PasswordResetInput = z.infer<typeof passwordResetSchema>;

/**
 * Validate data against schema
 */
export const validateData = <T>(schema: z.ZodSchema, data: unknown): { valid: boolean; data?: T; error?: string } => {
  try {
    const validated = schema.parse(data);
    return { valid: true, data: validated as T };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessage = error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join('; ');
      return { valid: false, error: errorMessage };
    }
    return { valid: false, error: 'Validation failed' };
  }
};

/**
 * Company profile update schema
 */
export const updateCompanyProfileSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  email: emailSchema.optional(),
  phone: z.string().optional(),
  website: z.string().url().optional().or(z.literal('')),
  gstTinNumber: z.string().optional(),
  defaultCurrencyCode: z.string().length(3).optional(),
  logoUrl: z.string().url().optional().or(z.literal('')),
  headerNote: z.string().optional(),
  footerNote: z.string().optional(),
  defaultTerms: z.string().optional(),
  defaultInvoiceTerms: z.string().optional(),
  defaultQuotationTerms: z.string().optional(),
  address: z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    zip: z.string().optional(),
    country: z.string().optional(),
  }).optional(),
  socialLinks: z.object({
    facebook: z.string().optional(),
    instagram: z.string().optional(),
    linkedin: z.string().optional(),
    twitter: z.string().optional(),
  }).optional(),
  bankAccounts: z.array(z.object({
    bankName: z.string(),
    accountHolder: z.string(),
    accountNumber: z.string(),
    ifscCode: z.string(),
    branchName: z.string().optional(),
  })).optional(),
});

export type UpdateCompanyProfileInput = z.infer<typeof updateCompanyProfileSchema>;
