import { NextFunction, Request, Response } from "express";
import { SignUpCodeSchema, SignUpSchema } from "../schemas/signup";
import { createUser, getUserByEmail, getUserById, getUserByPhone, verifyPhone } from "../repositories/users";
import { OnetimeCodeType } from '../types';
import { createUserCode, deleteUserCodes, getUserCodes } from '../repositories/verificationCode';
import { getTokens } from '../passport';
import { RefreshTokenSchema, SignInEmailSchema, SignInMobileSchema } from '../schemas/auth';
import { compare } from 'bcryptjs';
import { deleteRefreshToken, getRefreshToken } from '../repositories/tokens';
import { isValidToken } from '../utils/auth';

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
          // TODO: remove code after 
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

    if (!user) {
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
      deleteUserCodes(user.id, OnetimeCodeType.PHONE);
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

  async mobile(req: Request, res: Response, next: NextFunction) {
    console.log('Authorization with phone number');
    const grant_type = req.body.grant_type;

    if (grant_type === 'mobile') {
      const validatedValues = SignInMobileSchema.safeParse(req.body);
      if (validatedValues.success) {
        const { phone } = validatedValues.data;
        const user = await getUserByPhone(phone);
  
        if (user && user.phoneVerified) {
          const code = await createUserCode(user.id, OnetimeCodeType.PHONE);
          return res.json({
            success: true,
            payload: {
              token: user.id,
              // TODO: remove code after 
              onetimecode: code.code
            }
          });
        }
        return res.json({
          success: false,
          error: {
            message: "User not found"
          }
        });
      }

      return res.json({
        success: false,
        error: {
          message: "Wrong phone number",
          error: validatedValues.error
        }
      })
    }

    next();
  },

  async singIn(req: Request, res: Response, next: NextFunction) {
    const grant_type = req.body.grant_type;

    if (grant_type === 'password') {
      const validatedValues = SignInEmailSchema.safeParse(req.body);

      if (validatedValues.success) {
        const { username, password } = validatedValues.data;

        const user = await getUserByEmail(username);
        
        if (user && user.passwordHash && await compare(password, user.passwordHash)) {
          const { accessToken, refreshToken, expiresAt } = await getTokens(user);

          return res.json({
            success: true,
            payload: {
              'access_token': accessToken,
              'refresh_token': refreshToken,
              'token_type': 'Bearer',
              'expires_in': expiresAt,
            }
          });
        }
   
        return res.json({
          success: false,
          error: {
            message: 'Wrong credentials'
          }
        });
      }

      return res.json({
        success: false,
        error: {
          message: "Wrong request"
        }
      });
    }

    next();
  },

  async refresh(req: Request, res: Response, next: NextFunction) {
    const grant_type = req.body.grant_type;

    if (grant_type === 'refresh_token') {
      const validatedValues = RefreshTokenSchema.safeParse(req.body);

      if (validatedValues.success) {
        const { refresh_token } = validatedValues.data;

        const token = await getRefreshToken(refresh_token);
        
        if (token && isValidToken(token)) {
          deleteRefreshToken(refresh_token);
      
          const tokens = await getTokens(token.user);
          return res.json({
            success: true,
            payload: {
              access_token: tokens.accessToken,
              refresh_token: tokens.refreshToken,
              expires_in: tokens.expiresAt,
              'token_type': 'Bearer',
            }
          })
        }
      
        return res.json({
          success: false,
          error: {
            message: "Invalid token",
          }
        });
      }

      return res.json({
        success: false,
        error: {
          message: "Invalid request",
        }
      });
    }

    next();
  }
};
