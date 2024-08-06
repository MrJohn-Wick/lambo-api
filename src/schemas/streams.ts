import * as z from 'zod';

export const StreamCreateSchema = z.object({
  title: z.string().min(1),
  user_id: z.string().optional(),
  categories: z.array(z.string()).min(1),
  preview: z.string().optional(),
});

export const StreamEditSchema = z.object({
  title: z.string().min(1).optional(),
  user_id: z.string().optional(),
  categories: z.array(z.string()).min(1).optional(),
  preview: z.string().optional(),
});