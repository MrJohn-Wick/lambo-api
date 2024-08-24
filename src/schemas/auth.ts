import validator from 'validator';
import * as z from 'zod';

export const SignInMobileSchema = z.object({
  grant_type: z.literal('mobile'),
  phone: z.string().refine(validator.isMobilePhone),
});

export const SignInEmailSchema = z.object({
  grant_type: z.literal('password'),
  username: z.string().email(),
  password: z.string().min(1),
});

export const RefreshTokenSchema = z.object({
  grant_type: z.literal('refresh_token'),
  refresh_token: z.string().min(1),
});
