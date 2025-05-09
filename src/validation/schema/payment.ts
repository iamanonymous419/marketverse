import { z } from 'zod';

export const PaymentSchema = z.object({
  username: z
    .string()
    .nonempty('username is required')
    .min(10, 'username is too short'),
  password: z
    .string()
    .nonempty('password is required')
    .min(10, 'password is too short'),
});

export type PaymentType = z.infer<typeof PaymentSchema>;
