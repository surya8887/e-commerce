import { z } from 'zod';

export const signUpSchema = z
  .object({
    username: z
      .string()
      .min(3, { message: 'Username must be at least 3 characters' })
      .max(20, { message: 'Username must be at most 20 characters' })
      .regex(/^[a-zA-Z0-9_]+$/, {
        message: 'Username can only contain letters, numbers, and underscores',
      }),

    email: z
      .string()
      .email({ message: 'Please enter a valid email address' })
      .max(100, { message: 'Email must be at most 100 characters long' }),

    password: z
      .string()
      .min(5, { message: 'Password must be at least 5 characters' })
      .max(25, { message: 'Password must be at most 25 characters' })
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&]).*$/, {
        message:
          'Password must contain at least 1 uppercase, 1 lowercase, 1 number, and 1 special character',
      }),

    confirm_password: z
      .string()
      .min(5, { message: 'Password must be at least 5 characters' })
      .max(25, { message: 'Password must be at most 25 characters' }),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: 'Passwords do not match',
    path: ['confirm_password'],
  });
