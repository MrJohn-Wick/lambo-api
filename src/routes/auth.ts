import { Request, Response, Router } from 'express';
import passport from 'passport';
import { authController } from '../controllers/auth';
import { generateToken } from '../utils/auth';
import { storeTokens } from '../repositories/tokens';
import { User } from '@prisma/client';
import { resetController } from '../controllers/reset';

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
  '/signin/code',
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
      description: '',
      schema: {
        $username: 'username@example.com',
        $password: '123456',
      }
    } 
  */
  '/signin/password',
  authController.singIn,
);

authRouter.post(
  /* 
    #swagger.tags = ['Security']
    #swagger.summary = 'User login by credentials'
    #swagger.description = 'Exchnage user credentials to access_token <br>
    or refresh_token to access_token <BR><BR>
    +79154664152 for Nestor.Kihn91@ya.ru <br>
    +79507374830 for Samson.Wehner9@hotmail.com <br>
    +79171097285 for Savvatii_Kovacek47@mail.ru <br>
    +79584065397 for Miron.Tromp@yandex.ru <br>
    +79664606744 for Kondrat_Krajcik72@yahoo.com <br>
    +79703694542 for Kseniya_Prosacco@yahoo.com <br>
    '
    #swagger.parameters['body'] = {
      in: 'body',
      description: '',
      schema: {
        $phone: '+79154664152',
      }
    } 
  */
  '/signin/mobile',
  authController.mobile,
);

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
        $refresh_token: '<refresh_token>',
      }
    } 
  */
  '/signin/refresh',
  authController.refresh,
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

authRouter.post(
  /* 
    #swagger.tags = ['Security']
    #swagger.summary = 'Start user password reset flow'
    #swagger.description = ''
    #swagger.parameters['body'] = {
      in: 'body',
      schema: {
        $identity: 'email or password',
      }
    } 
  */
  '/signin/reset',
  resetController.reset,
);

authRouter.post(
  /* 
    #swagger.tags = ['Security']
    #swagger.summary = 'Verify user started password reset'
    #swagger.description = ''
    #swagger.parameters['body'] = {
      in: 'body',
      schema: {
        $token: '',
        $code: '',
      }
    } 
  */
  '/signin/reset/code',
  resetController.resetCode
);

authRouter.post(
  /* 
    #swagger.tags = ['Security']
    #swagger.summary = 'Start user password reset flow'
    #swagger.description = ''
    #swagger.parameters['body'] = {
      in: 'body',
      schema: {
        $token: '',
        $password: '',
      }
    } 
  */
  '/signin/reset/password',
  resetController.resetPassword
);
