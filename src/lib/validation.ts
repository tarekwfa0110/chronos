import { z } from 'zod';

// Base validation schemas
export const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .email('Please enter a valid email address')
  .toLowerCase()
  .trim();

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number');

export const nameSchema = z
  .string()
  .min(1, 'Name is required')
  .min(2, 'Name must be at least 2 characters')
  .max(50, 'Name must be less than 50 characters')
  .regex(/^[a-zA-Z\s'-]+$/, 'Name can only contain letters, spaces, hyphens, and apostrophes')
  .trim();

export const phoneSchema = z
  .string()
  .min(1, 'Phone number is required')
  .regex(/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number')
  .optional();

// User authentication schemas
export const signUpSchema = z.object({
  fullName: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const signInSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const resetPasswordSchema = z.object({
  password: passwordSchema,
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const updateProfileSchema = z.object({
  fullName: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
});

// Address schemas
export const addressSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
  company: z.string().max(100, 'Company name must be less than 100 characters').optional(),
  addressLine1: z.string().min(1, 'Address is required').max(100, 'Address must be less than 100 characters'),
  addressLine2: z.string().max(100, 'Address must be less than 100 characters').optional(),
  city: z.string().min(1, 'City is required').max(50, 'City must be less than 50 characters'),
  state: z.string().min(1, 'State is required').max(50, 'State must be less than 50 characters'),
  postalCode: z.string().min(1, 'Postal code is required').regex(/^[0-9A-Za-z\s\-]{3,10}$/, 'Please enter a valid postal code'),
  country: z.string().min(1, 'Country is required'),
  phone: phoneSchema,
  isDefault: z.boolean().default(false),
});

// Checkout schemas
export const contactInfoSchema = z.object({
  email: emailSchema,
  phone: phoneSchema,
  marketingConsent: z.boolean().default(false),
});

export const shippingAddressSchema = addressSchema;

export const billingAddressSchema = z.object({
  ...addressSchema.shape,
  sameAsShipping: z.boolean().default(true),
});

export const paymentMethodSchema = z.object({
  method: z.enum(['card', 'paypal', 'apple_pay', 'google_pay']),
  saveForFuture: z.boolean().default(false),
});

export const checkoutSchema = z.object({
  contactInfo: contactInfoSchema,
  shippingAddress: shippingAddressSchema,
  billingAddress: billingAddressSchema,
  paymentMethod: paymentMethodSchema,
  message: z.string().max(500, 'Message must be less than 500 characters').optional(),
  donation: z.number().min(0, 'Donation must be positive').optional(),
});

// Product search and filter schemas
export const searchSchema = z.object({
  query: z.string().min(1, 'Search query is required').max(100, 'Search query too long'),
  category: z.string().optional(),
  minPrice: z.number().min(0, 'Minimum price must be positive').optional(),
  maxPrice: z.number().min(0, 'Maximum price must be positive').optional(),
  sortBy: z.enum(['name', 'price', 'newest', 'popular']).default('name'),
  sortOrder: z.enum(['asc', 'desc']).default('asc'),
});

// Review schemas (for future use)
export const reviewSchema = z.object({
  rating: z.number().min(1, 'Rating is required').max(5, 'Rating must be between 1 and 5'),
  title: z.string().min(1, 'Review title is required').max(100, 'Title must be less than 100 characters'),
  comment: z.string().min(10, 'Review must be at least 10 characters').max(1000, 'Review must be less than 1000 characters'),
  recommend: z.boolean().default(true),
});

// Contact form schema
export const contactFormSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  subject: z.string().min(1, 'Subject is required').max(100, 'Subject must be less than 100 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters').max(1000, 'Message must be less than 1000 characters'),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
});

// Newsletter subscription schema
export const newsletterSchema = z.object({
  email: emailSchema,
  preferences: z.object({
    productUpdates: z.boolean().default(true),
    promotions: z.boolean().default(false),
    blogPosts: z.boolean().default(true),
  }).default({
    productUpdates: true,
    promotions: false,
    blogPosts: true,
  }),
});

// Export types
export type SignUpFormData = z.infer<typeof signUpSchema>;
export type SignInFormData = z.infer<typeof signInSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;
export type AddressFormData = z.infer<typeof addressSchema>;
export type ContactInfoFormData = z.infer<typeof contactInfoSchema>;
export type ShippingAddressFormData = z.infer<typeof shippingAddressSchema>;
export type BillingAddressFormData = z.infer<typeof billingAddressSchema>;
export type PaymentMethodFormData = z.infer<typeof paymentMethodSchema>;
export type CheckoutFormData = z.infer<typeof checkoutSchema>;
export type SearchFormData = z.infer<typeof searchSchema>;
export type ReviewFormData = z.infer<typeof reviewSchema>;
export type ContactFormData = z.infer<typeof contactFormSchema>;
export type NewsletterFormData = z.infer<typeof newsletterSchema>;

// Validation error helper
export const getFieldError = (errors: any, fieldName: string): string | undefined => {
  const fieldPath = fieldName.split('.');
  let current = errors;
  
  for (const path of fieldPath) {
    if (current && typeof current === 'object' && path in current) {
      current = current[path];
    } else {
      return undefined;
    }
  }
  
  return current?.message;
};

// Real-time validation helper
export const validateField = async (schema: z.ZodSchema, value: any, fieldName: string) => {
  try {
    await schema.parseAsync({ [fieldName]: value });
    return { isValid: true, error: undefined };
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      const fieldError = error.errors.find(err => err.path.includes(fieldName));
      return { isValid: false, error: fieldError?.message };
    }
    return { isValid: false, error: 'Validation failed' };
  }
};