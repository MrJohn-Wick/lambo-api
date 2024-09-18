import langs from 'langs';
import * as z from 'zod';
import { s3 } from '../controllers/upload';
import { GetObjectCommand } from '@aws-sdk/client-s3';

const PriceTypeSchema = z.union([
  z.literal('ticket'),
  z.literal('rate'),
]);

export const StreamCreateSchema = z.object({
  cover: z.string().optional(),
  title: z.string().min(1).max(100),
  description: z.string().min(1).max(200).optional(),
  language: z.string().min(1),
  categories: z.array(z.string()).min(1).max(3),
  price_type: PriceTypeSchema,
  price: z.number().finite().safe().gte(0),
  start_now: z.boolean().default(false),
  start_time: z.string().datetime().optional(),
  duration: z.number().int().min(1).optional(),
  charity: z.number().int().min(0).max(100).optional(),
  invited: z.array(z.string().min(1)).optional(),
  is_private: z.boolean().optional(),
  comments_off: z.boolean().optional(),
}).superRefine((
  { start_now, start_time },
  refinementContext
) => {
  if (!start_now && !start_time) {
    refinementContext.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Field must exist if start_now is false.",
      path: ['start_time']
    });
  }
  if (start_time && new Date(start_time) < new Date()) {
    refinementContext.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Start time must be in furute.",
      path: ['start_time']
    });
  }
}).superRefine(( 
  { language },
  refinementContext
) => {
  const langsCodes = langs.all().map(l => l['1']);
  if (language && !langsCodes.includes(language)) {
    refinementContext.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Language code in wrong",
      path: ['language']
    });
  }
}).superRefine(async (
  { cover },
  context
) => {
  if (cover) {
    const getObject = new GetObjectCommand({ Bucket: process.env.S3_LAMBO_AVATARS || 'lambo-avatars', Key: cover });
    try {
      const object = await s3.send(getObject);
    } catch (e) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Wrong file key',
        path: ['cover']
      });
    }
  }
});

export const StreamEditSchema = z.object({
  cover: z.string().optional(),
  title: z.string().min(1).max(100).optional(),
  description: z.string().min(1).max(200).optional(),
  language: z.string().min(1).optional(),
  categories: z.array(z.string()).min(1).max(3).optional(),
  price_type: PriceTypeSchema.optional(),
  price: z.number().finite().safe().gte(0).optional(),
  start_now: z.boolean().optional(),
  start_time: z.string().datetime().optional(),
  duration: z.number().int().min(1).optional(),
  charity: z.number().int().min(0).max(100).optional(),
  invited: z.array(z.string().min(1)).optional(),
  is_private: z.boolean().optional(),
  comments_off: z.boolean().optional(),
}).superRefine((
  { start_now, start_time },
  refinementContext
) => {
  if (!start_now && !start_time) {
    refinementContext.addIssue({
      code: z.ZodIssueCode.custom,
      message: "field must be if start_now is true",
      path: ['start_time']
    });
  }
});
