import { NextFunction, Request, Response } from 'express';
import { apiErrorResponse, apiSuccessResponse } from '../utils/responses';
import { tmpMulter } from '../utils/s3';


export function uploadAvatarController(req: Request, res: Response, next: NextFunction) {
  const upload =  tmpMulter.single('avatar');

  // TODO: validation
  upload(req, res, async (err) => {
    if (err) {
      console.log("Upload ERROR", req.file, err);
      return res.status(409).json(apiErrorResponse("upload error"));
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


export function uploadStreamCoverController(req: Request, res: Response, next: NextFunction) {
  const upload =  tmpMulter.single('cover');

  // TODO: validation
  upload(req, res, async (err) => {
    if (err) {
      console.log("Upload ERROR", req.file, err);
      return res.status(409).json(apiErrorResponse("upload error"));
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
