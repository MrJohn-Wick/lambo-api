import { NextFunction, Request, Response } from 'express';
import { apiErrorResponse, apiSuccessResponse } from '../utils/responses';
import { getS3PublicKey, tmpMulter, userGalleryMulter } from '../utils/s3';
import { ErrorMessages } from '../constants';
import { galleryAppendImages, getGalleryByUserId } from '../repositories/galleries';


export async function uploadAvatarController(req: Request, res: Response, next: NextFunction) {
  const user = req.user;
  if (!user) {
    return res.status(401).json(apiErrorResponse(ErrorMessages.unauthorized));
  }

  const gallery = await getGalleryByUserId(user.id);
  if (!gallery) {
    return res.status(404).json(apiErrorResponse(ErrorMessages.galleryNotFound));
  }

  const upload = userGalleryMulter(gallery.id).array('avatar');
  upload(req, res, async (err) => {
    if (err) {
      console.log("Upload ERROR", req.file, err);
      return res.status(409).json(apiErrorResponse(ErrorMessages.storageUploadError));
    } else {
      console.log("Upload SUCCESS", req.files, typeof req.files);
      const files: Express.MulterS3.File[] = req.files as Express.MulterS3.File[];

      const images = await galleryAppendImages(gallery.id, files.map( f => (f.key) ));
      if (!images) {
        return res.status(409).json(apiErrorResponse(ErrorMessages.uploadError));
      }

      return res.json(apiSuccessResponse({
        uri: getS3PublicKey(images[0].key),
        key: images[0].key,
      }));
    }
  });
}


export function uploadStreamCoverController(req: Request, res: Response, next: NextFunction) {
  const upload =  tmpMulter.single('cover');

  // TODO: validation
  upload(req, res, async (err) => {
    if (err) {
      console.log("Upload ERROR", req.file, err);
      return res.status(409).json(apiErrorResponse(ErrorMessages.storageUploadError));
    } else {
      console.log("Upload SUCCESS", req.file, typeof req.file);
      const file: Express.MulterS3.File = req.file as Express.MulterS3.File;
      
      return res.json(apiSuccessResponse({
        uri: file.location,
        key: file.key,
      }));
    }
  });
}
