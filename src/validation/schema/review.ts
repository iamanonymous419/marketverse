import { z } from 'zod';

export const reviewSchema = z.object({
  reviewMessage: z.string().min(5, 'Review must be at least 5 characters'),
  reviewStar: z
    .number()
    .min(1, 'Must select at least 1 star')
    .max(5, 'Cannot be more than 5 stars'),
  productId: z.number().optional(),
  email: z.string().optional(),
});

export type ReviewFormData = z.infer<typeof reviewSchema>;
