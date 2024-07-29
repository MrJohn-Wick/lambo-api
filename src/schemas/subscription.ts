import * as z from 'zod';

export const SubscriptionSchema = z.object({
  authorId: z.string(),
});