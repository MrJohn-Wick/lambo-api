import validator from 'validator';
import * as z from 'zod';

export const SignInMobileSchema = z.object({
  grant_type: z.string(),
  phone: z.string().refine(validator.isMobilePhone),
});
