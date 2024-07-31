import * as z from 'zod';

export const SignUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  username: z.string().min(1),
  fullname: z.string().min(1),
  photo: z.string().optional(),
  phone: z.string().optional(),
  location: z.string().optional(),
  about: z.string().optional(),
  availableForCall: z.boolean().optional(),
});