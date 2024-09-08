import { S3Client } from '@aws-sdk/client-s3';
import { randomUUID } from 'crypto';
import { NextFunction, Request, Response } from 'express';
import multer from 'multer';
import multerS3 from 'multer-s3';
import { apiErrorResponse, apiSuccessResponse } from '../utils/responses';
import { updateAvatar } from '../repositories/profile';

const s3 = new S3Client({
  region: 'lambo-me',
  forcePathStyle: true,
  // logger: console,
  disableHostPrefix: true,
  endpoint: process.env.S3_ENDPOINT,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY || '',
    secretAccessKey: process.env.S3_SECRET_KEY || '',
  }
});

const avatarMulter = multer({
  storage: multerS3({
    s3,
    bucket: process.env.S3_LAMBO_AVATARS || 'lambo-avatars',
    acl: 'public-read',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function(req, file, cb) {
      const typeParts = file.mimetype.split('/');
      cb(null, `avatars/${ randomUUID() }.${ typeParts[1] }`);
    },
  })
});

export function uploadAvatarController(req: Request, res: Response, next: NextFunction) {
  const upload =  avatarMulter.single('avatar');

  // TODO: validation
  upload(req, res, async (err) => {
    if (err) {
      console.log("Upload ERROR", req.file, err);
      return res.status(409).json(apiErrorResponse("upload error"));
    } else {
      console.log("Upload SUCCESS", req.file, typeof req.file);
      const file: Express.MulterS3.File = req.file as Express.MulterS3.File;

      if (req.user) {
        await updateAvatar(req.user.id, file.location);
      }
      
      return res.json(apiSuccessResponse({
        uri: file.location
      }));
    }
  });
}
