import { z } from 'zod';

export const NewsLetterSchema = z.object({
  email: z
    .string()
    .email('Invalid email')
    .nonempty('Email is required')
    .min(10, 'Email is too short'),
});

export type NewsLetterType = z.infer<typeof NewsLetterSchema>;
