import validator from 'validator';
import * as z from 'zod';

export const SignUpSchema = z.object({
  email: z.string().email(),
  phone: z.string().refine(validator.isMobilePhone, "Invalid phone number"),
});

export const SignUpCodeSchema = z.object({
  token: z.string().min(1),
  code: z.string().min(4).max(4),
});

export const PasswordUpdateSchema = z.object({
  password: z.string().min(8),
});
