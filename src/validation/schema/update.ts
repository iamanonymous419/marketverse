import { z } from 'zod';

export const updateSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: 'First name must be at least 2 characters' })
    .max(50, { message: 'First name must not exceed 50 characters' }),
  lastName: z.string().optional(),
  age: z
    .number()
    .min(18, { message: 'Must be at least 18 years old' })
    .max(120, { message: 'Please enter a valid age' }),
  phoneNo: z
    .string()
    .regex(/^\+?[\d\s-]+$/, { message: 'Please enter a valid phone number' }),
  gender: z.enum(['male', 'female', 'other', 'prefer-not-to-say'], {
    required_error: 'Please select a gender',
  }),
  profileImageUrl: z.string().optional(),
  email: z.string().optional(),
});

export type updateType = z.infer<typeof updateSchema>;
// this schema will work for both seller and buyer page
