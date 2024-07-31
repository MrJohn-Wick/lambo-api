import { Request, Response, Router } from 'express';
import passport from 'passport';
import { authController } from '../controllers/auth';
import { oauthServer } from '../passport';
import { generateToken } from '../utils/auth';
import { storeTokens } from '../repositories/tokens';
import { User } from '@prisma/client';

export const authRouter = Router();

authRouter.post(
  /* 
    #swagger.tags = ['Security']
    #swagger.summary = 'Register new user'
    #swagger.description = 'Register new user by they credentials'
    #swagger.consumes = ['application/json', 'application/x-www-form-urlencoded']
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'User credentials',
      schema: {
        $email: 'username@example.com',
        $password: '123456',
        $username: 'stive',
        $fullname: 'Stive Jobs',
        $phone: '+7**********',
        $photo: '',
        $location: 'USA',
        $about: 'Some text',
        $availableForCall: false,
      }
    } 
  */
  '/signup',
  authController.signUp
);

authRouter.post(
  /* 
    #swagger.tags = ['Security']
    #swagger.summary = 'User login by credentials'
    #swagger.description = 'Exchnage user credentials to access_token'
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'OAuth2 implict flow parameters',
      schema: {
        $username: 'username@example.com',
        $password: '123456',
        $grant_type: 'password'
      }
    } 
  */
  '/oauth/token',
  oauthServer.token(),
  oauthServer.errorHandler()
);

authRouter.get(
  /* 
    #swagger.tags = ['Security']
    #swagger.summary = 'Login with Google'
    #swagger.description = 'Exchnage goole access_token to API access_token'
    #swagger.security = [{
      "apiKeyAuth": []
    }]
  */
  '/oauth/provider/google',
  passport.authenticate('google-token', { session: false }),
  async (req: Request, res: Response) => {
    const aToken = generateToken();
    const rToken = generateToken();
    const expiresAt = new Date(new Date().getTime() + 60*60*1000);
    if (req.user) {
      await storeTokens(req.user as User, aToken, rToken, expiresAt);
      res.json({
        token_type: 'Bearer',
        access_token: aToken,
        refresh_token: rToken,
        expires_in: expiresAt,
      });
    }
    res.status(401);
  }
);
