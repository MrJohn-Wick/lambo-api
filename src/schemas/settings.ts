import * as z from 'zod';

export const UserSettingsSchema = z.object({
  notifications: z.boolean().optional(),
  dark: z.boolean().optional(),
  tfa: z.boolean().optional(),
  incognito: z.boolean().optional(),
  isMinimized: z.boolean().optional(),
});
