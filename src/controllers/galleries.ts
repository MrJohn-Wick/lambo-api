import { NextFunction, Request, Response } from 'express';
import { userGalleryMulter } from '../utils/s3';
import { apiErrorResponse, apiSuccessResponse } from '../utils/responses';
import { deleteImage, galleryAppendImages, getGallery, getGalleryByUserId, getImage } from '../repositories/galleries';
import { ErrorMessages } from '../constants';
import { getUserById, getUserByUsername } from '../repositories/users';

export const GalleriesController = {

  async get(req: Request, res: Response, next: NextFunction) {
    const galleryId = req.params.id;
    const user = req.user;
    if (!user) {
      return res.status(401).json(apiErrorResponse(ErrorMessages.unauthorized));
    }

    const gallery = await getGallery(galleryId);
    if (!gallery) {
      return res.status(404).json(apiErrorResponse(ErrorMessages.galleryNotFound));
    }

    return res.json(apiSuccessResponse(gallery));
  },

  async getByUserName(req: Request, res: Response, next: NextFunction) {
    const username = req.params.username;
    const user = req.user;
    if (!user) {
      return res.status(401).json(apiErrorResponse(ErrorMessages.unauthorized));
    }

    const userModel = await getUserByUsername(username);
    if (!userModel) {
      return res.status(404).json(apiErrorResponse(ErrorMessages.userNotFound));
    }

    const gallery = await getGalleryByUserId(userModel.id);
    if (!gallery) {
      return res.status(404).json(apiErrorResponse(ErrorMessages.galleryNotFound));
    }

    return res.json(apiSuccessResponse(gallery));
  },

  async upload(req: Request, res: Response, next: NextFunction) {
    const galleryId = req.params.id;
    const user = req.user;
    if (!user) {
      return res.status(401).json(apiErrorResponse(ErrorMessages.unauthorized));
    }

    const userModel = await getUserById(user?.id);
    if (!userModel) {
      return res.status(401).json(apiErrorResponse(ErrorMessages.unauthorized));
    }

    const gallery = await getGallery(galleryId);
    if (!gallery) {
      return res.status(404).json(apiErrorResponse(ErrorMessages.galleryNotFound));
    }

    if (gallery.profile.id !== userModel.profile?.id) {
      return res.status(403).json(apiErrorResponse(ErrorMessages.permissionDenied));
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
    if (!user) {
      return res.status(401).json(apiErrorResponse(ErrorMessages.unauthorized));
    }

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
