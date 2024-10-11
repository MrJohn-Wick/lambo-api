import validator from 'validator';
import * as z from 'zod';
import { ErrorMessages } from '../constants';

export const SignUpSchema = z.object({
  email: z.string().email(ErrorMessages.invalidEmail),
  phone: z.string().refine(validator.isMobilePhone, ErrorMessages.invalidPhone),
});

export const SignUpCodeSchema = z.object({
  token: z.string().min(1),
  code: z.string().min(4).max(4),
});

export const PasswordUpdateSchema = z.object({
  password: z.string().min(8, ErrorMessages.invalidPassword),
});
