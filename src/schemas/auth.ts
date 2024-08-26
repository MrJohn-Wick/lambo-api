import validator from 'validator';
import * as z from 'zod';

export const SignInMobileSchema = z.object({
  phone: z.string().refine(validator.isMobilePhone),
});

export const SignInEmailSchema = z.object({
  username: z.string().email(),
  password: z.string().min(1),
});

export const RefreshTokenSchema = z.object({
  refresh_token: z.string().min(1),
});
