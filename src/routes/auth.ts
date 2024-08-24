import { Request, Response, Router } from 'express';
import passport from 'passport';
import { authController } from '../controllers/auth';
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
        $phone: '+375000000000',
      }
    } 
  */
  '/signup',
  authController.signUp
);

authRouter.post(
  /* 
    #swagger.tags = ['Security']
    #swagger.summary = 'Confirm phone number'
    #swagger.description = 'Register new user by they credentials'
    #swagger.consumes = ['application/json', 'application/x-www-form-urlencoded']
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'User credentials',
      schema: {
        $token: '',
        $code: '',
      }
    } 
  */
  '/singin/code',
  authController.signUpCode
)

authRouter.post(
  /* 
    #swagger.tags = ['Security']
    #swagger.summary = 'User login by credentials'
    #swagger.description = 'Exchnage user credentials to access_token <br>
    or refresh_token to access_token <BR><BR>
    Nestor.Kihn91@ya.ru <br>
    Samson.Wehner9@hotmail.com <br>
    Savvatii_Kovacek47@mail.ru <br>
    Miron.Tromp@yandex.ru <br>
    Kondrat_Krajcik72@yahoo.com <br>
    Kseniya_Prosacco@yahoo.com <br>
    '
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'OAuth2 implict flow parameters or refresh flow parameters',
      schema: {
        $username: 'username@example.com',
        $password: '123456',
        $refresh_token: '<refresh_token>',
        $phone: '+7123456789',
        $grant_type: 'password or refresh_token or mobile'
      }
    } 
  */
  '/singin/token',
  authController.refresh,
  authController.mobile,
  authController.singIn,
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
  '/signin/provider/google',
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
