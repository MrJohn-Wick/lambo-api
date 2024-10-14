import z from 'zod';
import { ErrorMessages } from '../constants';

export const ProfileUpdateSchema = z.object({
  username: z.string().min(1).optional(),
  firstname: z.string().min(1).optional(),
  lastname: z.string().min(1).optional(),
  birthday: z.string().datetime().optional(),
  location: z.string().min(1).optional(),
  categories: z.array(z.string()).optional(),
}).refine(
  ({ username, firstname, lastname, birthday, location, categories }) => 
    username !== undefined || 
    firstname !== undefined || 
    lastname !== undefined ||
    birthday != undefined ||
    location != undefined ||
    categories !== undefined
  ,
  { message: ErrorMessages.noOneField }
);
