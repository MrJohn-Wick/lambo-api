
import { GetObjectCommand } from '@aws-sdk/client-s3';
import z from 'zod';
import { s3client } from '../utils/s3';
import { ErrorMessages } from '../constants';

export const ProfileUpdateSchema = z.object({
  username: z.string().min(1).optional(),
  firstname: z.string().min(1).optional(),
  lastname: z.string().min(1).optional(),
  birthday: z.string().datetime().optional(),
  location: z.string().min(1).optional(),
  categories: z.array(z.string()).optional(),
  avatar: z.string().optional(),
}).refine(
  ({ username, firstname, lastname, birthday, location, categories, avatar }) => 
    username !== undefined || 
    firstname !== undefined || 
    lastname !== undefined ||
    birthday != undefined ||
    location != undefined ||
    categories !== undefined ||
    avatar !== undefined
  ,
  { message: ErrorMessages.noOneField }
).superRefine(async (
  { avatar },
  context
) => {
  if (avatar) {
    const getObject = new GetObjectCommand({ Bucket: process.env.S3_BUCKET || 'lambo', Key: avatar });
    try {
      const object = await s3client.send(getObject);
    } catch (e) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: ErrorMessages.s3WrongKey,
        path: ['cover']
      });
    }
  }
});
