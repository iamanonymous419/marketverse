import * as z from 'zod';

export const addressSchema = z.object({
  country: z.string().min(1, 'Country is required'),
  fullName: z.string().min(1, 'Full name is required'),
  streetName: z.string().min(1, 'Street name is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  pincode: z
    .string()
    .min(1, 'Pincode is required')
    .regex(/^\d+$/, 'Must be a valid pincode'),
  phoneNo: z
    .string()
    .min(10, 'Phone number must be at least 10 digits')
    .regex(/^\d+$/, 'Must be a valid phone number'),
  isDefault: z.boolean().default(false),
  email: z.string().email(),
  addressID: z.number().optional(),
});

export type AddressFormValues = z.infer<typeof addressSchema>;
