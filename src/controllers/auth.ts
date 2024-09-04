import { NextFunction, Request, Response } from "express";
import { SignUpCodeSchema, SignUpSchema } from "../schemas/signup";
import { createUser, getUserByEmail, getUserById, getUserByPhone, verifyPhone } from "../repositories/users";
import { OnetimeCodeType } from '../types';
import { createUserCode, deleteUserCodes, getCode } from '../repositories/verificationCode';
import { getTokens } from '../passport';
import { RefreshTokenSchema, SignInEmailSchema, SignInMobileSchema } from '../schemas/auth';
import { compare } from 'bcryptjs';
import { deleteRefreshToken, getRefreshToken } from '../repositories/tokens';
import { isValidToken } from '../utils/auth';
import { apiErrorResponse, apiSuccessResponse } from '../utils/responses';

export const authController = {
  async signUp(req: Request, res: Response) {
    const validatedValues = SignUpSchema.safeParse(req.body);
    
    if (!validatedValues.success) {
      const messages = validatedValues.error.errors.map((e) => e.message);
      return res.status(400).json(apiErrorResponse(messages.join('. ')));
    }
    
    const { email, phone } = validatedValues.data;
    
    let user = await getUserByEmail(email);
    if (user && user.emailVerified) {
      return res.status(406).json(apiErrorResponse('Email is alredy used'));
    }

    user = await getUserByPhone(phone);
    if (user && user.phoneVerified) {
      return res.status(406).json(apiErrorResponse('Phone is alredy used'));
    }

    if (!user) {
      user = await createUser(
        email,
        phone,
      );
    }

    if (user) {
      const code = await createUserCode(user.id, OnetimeCodeType.PHONE);

      // TODO: send one-time code to user
      return res.status(200).json(apiSuccessResponse({
        token: code.id,
        // TODO: remove code after sms service will be created
        onetimecode: code.code
      }));
    }

    return res.status(400).json(apiErrorResponse('Something went wrong.'));
  },

  async signUpCode(req: Request, res: Response) {
    const validatedValues = SignUpCodeSchema.safeParse(req.body);
    
    if (!validatedValues.success) {
      const messages = validatedValues.error.errors.map((e) => e.message);
      return res.status(400).json(apiErrorResponse(messages.join('. ')));
    }

    const { token, code } = validatedValues.data;
    const verificationCode = await getCode(token);

    if (!verificationCode) {
      return res.status(406).json(apiErrorResponse('Wrong code'));
    }

    if (verificationCode.type == OnetimeCodeType.PHONE) {
      verifyPhone(verificationCode.user_id);
      deleteUserCodes(verificationCode.user_id, OnetimeCodeType.PHONE);
  
      const user = await getUserById(verificationCode.user_id);
  
      if (!user) {
        return res.status(406).json(apiErrorResponse('User not found'));
      }
  
      const { accessToken, refreshToken, expiresAt } = await getTokens(user);
  
      return res.status(200).json(apiSuccessResponse({
        access_token: accessToken,
        token_type: 'Bearer',
        refresh_token: refreshToken,
        expires_in: expiresAt,
      }));
    }

    return res.status(406).json(apiErrorResponse('Wrong code'));
  },

  async mobile(req: Request, res: Response, next: NextFunction) {
    console.log('Authorization with phone number');
    const validatedValues = SignInMobileSchema.safeParse(req.body);

    if (!validatedValues.success) {
      const messages = validatedValues.error.errors.map((e) => e.message);
      return res.status(400).json(apiErrorResponse(messages.join('. ')));
    }

    const { phone } = validatedValues.data;
    const user = await getUserByPhone(phone);

    if (user && user.phoneVerified) {
      const code = await createUserCode(user.id, OnetimeCodeType.PHONE);

      return res.status(200).json(apiSuccessResponse({
        token: code.id,
        // TODO: remove code after
        onetimecode: code.code
      }));
    }

    return res.status(404).json(apiErrorResponse('User not found'));
  },

  async singIn(req: Request, res: Response, next: NextFunction) {
    const validatedValues = SignInEmailSchema.safeParse(req.body);

    if (!validatedValues.success) {
      const messages = validatedValues.error.errors.map((e) => e.message);
      return res.status(400).json(apiErrorResponse(messages.join('. ')));
    }

    const { username, password } = validatedValues.data;
    const user = await getUserByEmail(username);
    
    if (user && user.passwordHash && await compare(password, user.passwordHash)) {
      const { accessToken, refreshToken, expiresAt } = await getTokens(user);

      return res.status(200).json(apiSuccessResponse({
        'access_token': accessToken,
        'refresh_token': refreshToken,
        'token_type': 'Bearer',
        'expires_in': expiresAt,
      }));
    }

    return res.status(403).json(apiErrorResponse('Wrong credentials'));
  },

  async refresh(req: Request, res: Response, next: NextFunction) {
    const validatedValues = RefreshTokenSchema.safeParse(req.body);

    if (!validatedValues.success) {
      const messages = validatedValues.error.errors.map((e) => e.message);
      return res.status(400).json(apiErrorResponse(messages.join('. ')));
    }

    const { refresh_token } = validatedValues.data;

    const token = await getRefreshToken(refresh_token);
    
    if (token && isValidToken(token)) {
      deleteRefreshToken(refresh_token);
  
      const tokens = await getTokens(token.user);
      return res.status(200).json(apiSuccessResponse({
        access_token: tokens.accessToken,
        refresh_token: tokens.refreshToken,
        expires_in: tokens.expiresAt,
        'token_type': 'Bearer',
      }));
    }
  
    return res.status(406).json(apiErrorResponse('Invalid token'));
  },
};
