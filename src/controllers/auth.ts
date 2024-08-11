import { Request, Response } from "express";
import { SignUpCodeSchema, SignUpSchema } from "../schemas/signup";
import { createUser, getUserByEmail, getUserById, getUserByPhone, verifyPhone } from "../repositories/users";
import { OnetimeCodeType } from '../types';
import { createUserCode, getUserCodes } from '../repositories/verificationCode';
import { getTokens } from '../passport';

export const authController = {
  async signUp(req: Request, res: Response) {
    const validatedValues = SignUpSchema.safeParse(req.body);
    
    if (!validatedValues.success) {
      return res.json({
        success: false,
        error: {
          message: "Invalid request: " + validatedValues.error        
        }
      });
    }
    
    const { email, phone } = validatedValues.data;
    
    let user = await getUserByEmail(email);
    if (user && user.emailVerified) {
      return res.json({
        success: false,
        error: {
          message: 'Email is alredy used'
        }
      });
    }

    user = await getUserByPhone(phone);
    if (user && user.phoneVerified) {
      return res.json({
        success: false,
        error: {
          message: 'Phone is alredy used'
        }
      });
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
      return res.json({
        success: true,
        payload: {
          token: user.id,
          onetimecode: code.code
        }
      });
    }

    return {
      success: false,
      error: {
        message: 'Something went wrong.'
      }
    }
  },

  async signUpCode(req: Request, res: Response) {
    const validatedValues = SignUpCodeSchema.safeParse(req.body);
    
    if (!validatedValues.success) {
      return res.json({
        success: false,
        error: {
          message: "Invalid request: " + validatedValues.error        
        }
      });
    }

    const { token, code } = validatedValues.data;
    const user = await getUserById(token);

    if (!user || user.phoneVerified || user.emailVerified) {
      return res.json({
        success: false,
        error: {
          message: 'Wrong code'
        }
      });
    }

    const codes = await getUserCodes(user.id, OnetimeCodeType.PHONE);
    if (codes && code === codes[0].code) {
      verifyPhone(user.id);
      const { accessToken, refreshToken, expiresAt } = await getTokens(user);
      return res.json({
        access_token: accessToken,
        token_type: 'Bearer',
        refresh_token: refreshToken,
        expires_in: expiresAt,
      })
    }

    res.json({
      success: false,
      error: {
        message: 'Wrong code'
      }
    })
  },
};
