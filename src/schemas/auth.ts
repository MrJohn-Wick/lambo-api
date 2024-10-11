import validator from 'validator';
import * as z from 'zod';
import { ErrorMessages } from '../constants';

export const SignInMobileSchema = z.object({
  phone: z.string().refine(validator.isMobilePhone, ErrorMessages.invalidPhone),
});

export const SignInEmailSchema = z.object({
  username: z.string().email(ErrorMessages.invalidEmail),
  password: z.string().min(1, ErrorMessages.invalidPassword),
});

export const RefreshTokenSchema = z.object({
  refresh_token: z.string().min(1),
});

export const ResetIdentitySchema = z.object({
  identity: z.string().email().or(z.string().refine(validator.isMobilePhone)),
});

export const ResetPasswordSchema = z.object({
  token: z.string().min(1),
  password: z.string().min(8, ErrorMessages.invalidPassword),
});
