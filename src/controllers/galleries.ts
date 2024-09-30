import { NextFunction, Request, Response } from 'express';
import { userGalleryMulter } from '../utils/s3';
import { apiErrorResponse, apiSuccessResponse } from '../utils/responses';
import { deleteImage, galleryAppendImages, getGallery, getImage } from '../repositories/galleries';
import { ErrorMessages } from '../constants';

export const GalleriesController = {

  async get(req: Request, res: Response, next: NextFunction) {
    const galleryId = req.params.id;
    const user = req.user;
    if (!user) throw("Does'n have user after auth middleware!!!");

    const gallery = await getGallery(galleryId);
    if (!gallery) {
      return res.status(404).json(apiErrorResponse(ErrorMessages.galleryNotFound));
    }

    return res.json(apiSuccessResponse(gallery));
  },

  async upload(req: Request, res: Response, next: NextFunction) {
    const galleryId = req.params.id;
    const user = req.user;
    if (!user) throw("Does'n have user after auth middleware!!!");
  
    const gallery = await getGallery(galleryId);
    if (!gallery) {
      return res.status(404).json(apiErrorResponse(ErrorMessages.galleryNotFound));
    }

    const upload =  userGalleryMulter(galleryId).array('images');
  
    // TODO: validation
    upload(req, res, async (err) => {
      if (err) {
        console.log("Upload ERROR", req.file, err);
        return res.status(409).json(apiErrorResponse(ErrorMessages.storageUploadError));
      } else {
        console.log("Upload SUCCESS", req.files, typeof req.files);
        const files: Express.MulterS3.File[] = req.files as Express.MulterS3.File[];
  
        const images = await galleryAppendImages(galleryId, files.map( f => (f.key) ));
        if (!images) {
          return res.status(409).json(apiErrorResponse(ErrorMessages.uploadError));
        }

        return res.json(apiSuccessResponse(images));
      }
    });
  },

  async deleteImage(req: Request, res: Response, next: NextFunction) {
    const imageId = req.params.id;
    const user = req.user;
    if (!user) throw("Does'n have user after auth middleware!!!");

    const image = await getImage(imageId);
    if (!image) {
      return res.status(404).json(apiErrorResponse(ErrorMessages.imageNotFound));
    }

    const isDeleted = await deleteImage(imageId);
    if (isDeleted) {
      return res.json(apiSuccessResponse());
    }

    res.status(500).json(apiErrorResponse(ErrorMessages.unknown));
  }
}
