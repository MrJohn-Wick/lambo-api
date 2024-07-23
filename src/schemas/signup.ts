import * as z from 'zod';

export const SignUpSchema = z.object({
  username: z.string().email(),
  password: z.string().min(6),
});