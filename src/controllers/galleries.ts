import { NextFunction, Request, Response } from 'express';
import { userGalleryMulter } from '../utils/s3';
import { apiErrorResponse, apiSuccessResponse } from '../utils/responses';
import { galleryAppendImages, getGallery } from '../repositories/galleries';

export const GalleriesController = {
  async upload(req: Request, res: Response, next: NextFunction) {
    const galleryId = req.params.id;
    const user = req.user;
    if (!user) throw("Does'n have user after auth middleware!!!");
  
    const gallery = await getGallery(galleryId);
    if (!gallery) {
      return res.status(404).json(apiErrorResponse("Gallery not found"));
    }

    const upload =  userGalleryMulter(galleryId).array('images');
  
    // TODO: validation
    upload(req, res, async (err) => {
      if (err) {
        console.log("Upload ERROR", req.file, err);
        return res.status(409).json(apiErrorResponse("Storage upload error"));
      } else {
        console.log("Upload SUCCESS", req.file, typeof req.file);
        const files: Express.MulterS3.File[] = req.files as Express.MulterS3.File[];
  
        const images = await galleryAppendImages(galleryId, files.map( f => (f.key) ));
        if (!images) {
          return res.status(409).json(apiErrorResponse("Upload error"));
        }

        return res.json(apiSuccessResponse(images));
      }
    });
  }
}
