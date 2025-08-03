import { z } from 'zod';

export const signSchema = z.object({
  email: z
    .string()
    .email({ message: 'Please enter a valid email address' })
    .max(100, { message: 'Email must be at most 100 characters long' }),

  password: z
    .string()
    .min(5, { message: 'Password must be at least 5 characters' })
    .max(25, { message: 'Password must be at most 25 characters' }),
});
