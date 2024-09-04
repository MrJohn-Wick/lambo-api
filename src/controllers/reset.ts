import { NextFunction, Request, Response } from 'express';
import { getUserByEmail, getUserByPhone, updateUserPassword } from '../repositories/users';
import { createUserCode, deleteUserCodes, getCode } from '../repositories/verificationCode';
import { ResetIdentitySchema, ResetPasswordSchema } from '../schemas/auth';
import { apiErrorResponse, apiSuccessResponse } from '../utils/responses';
import { OnetimeCodeType } from '../types';
import { SignUpCodeSchema } from '../schemas/signup';
import validator from 'validator';

export const resetController = {

  async reset(req: Request, res: Response, next: NextFunction) {
    let user = null;

    const validatedValues = ResetIdentitySchema.safeParse(req.body);

    if (!validatedValues.success) {
      return res.status(400).json(apiErrorResponse("Invalid identity"));
    }

    const { identity } = validatedValues.data;

    if (validator.isMobilePhone(identity)) {
      user = await getUserByPhone(identity);
    } else {
      user = await getUserByEmail(identity);
    }

    if (!user) {
      return res.status(404).json(apiErrorResponse("User not found"));
    }

    const code = await createUserCode(user.id, OnetimeCodeType.RESET);

    return res.status(200).json(apiSuccessResponse({
      token: code.id,
      // TODO: remove code after sms service will be created
      onetimecode: code.code
    }));
  },

  async resetCode(req: Request, res: Response, next: NextFunction) {
    const validatedValues = SignUpCodeSchema.safeParse(req.body);
  
    if (!validatedValues.success) {
      const messages = validatedValues.error.errors.map((e) => e.message);
      return res.status(400).json(apiErrorResponse(messages.join('. ')));
    }

    const { token, code } = validatedValues.data;
    const verificationCode = await getCode(token);

    if (!verificationCode || verificationCode.type !== OnetimeCodeType.RESET || verificationCode.code !== code) {
      return res.status(406).json(apiErrorResponse('Wrong code'));
    }
    
    deleteUserCodes(verificationCode.user_id, OnetimeCodeType.RESET);

    const passwordCode = await createUserCode(verificationCode.user_id, OnetimeCodeType.PASSWORD);

    return res.status(200).json(apiSuccessResponse({
      token: passwordCode.id,
    }));

  },

  async resetPassword(req: Request, res: Response, next: NextFunction) {
    const validatedValues = ResetPasswordSchema.safeParse(req.body);

    if (!validatedValues.success) {
      const messages = validatedValues.error.errors.map((e) => e.message);
      return res.status(400).json(apiErrorResponse(messages.join('. ')));
    }

    const { token, password } = validatedValues.data;
    const verificationCode = await getCode(token);

    if (!verificationCode || verificationCode.type !== OnetimeCodeType.PASSWORD) {
      return res.status(406).json(apiErrorResponse('Wrong code'));
    }

    updateUserPassword(verificationCode.user_id, password);
    deleteUserCodes(verificationCode.user_id, OnetimeCodeType.PASSWORD);

    res.json({
      message: "Password changed"
    })
  },
}
