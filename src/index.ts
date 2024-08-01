import bodyParser from 'body-parser';
import express, { Request, Response } from 'express';
import passport from 'passport';
import { authController } from './controllers/auth';
import { oauthServer } from './passport';
import { profileController } from './controllers/profile';
import cors from 'cors';
import { generateToken } from './utils/auth';
import { storeTokens } from './repositories/tokens';
import { User } from '@prisma/client';
import swaggerUi from 'swagger-ui-express';
import { readFileSync } from 'fs';
import { usersRouter } from './routes/users';
import { subcriptionsRouter } from './routes/subscriptions';


const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.post(
  /* 
    #swagger.tags = ['Security']
    #swagger.summary = 'Register new user'
    #swagger.description = 'Register new user by they credentials'
    #swagger.consumes = ['application/json', 'application/x-www-form-urlencoded']
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'User credentials',
      schema: {
        $username: 'username@example.com',
        $password: '123456',
      }
    } 
  */
  '/signup',
  authController.signUp
);

app.post(
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

app.get(
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

app.get(
  /* 
    #swagger.tags = ['User']
    #swagger.description = 'Need to pass user access_token in Authorization header'
    #swagger.summary = 'Get current user profile'
    #swagger.produces = ['application/json']
    #swagger.security = [{
      "apiKeyAuth": []
    }]
  */
  '/me',
  passport.authenticate('bearer', { session: false }),
  profileController.me
);

app.use('/users', usersRouter);

app.use('/sub', subcriptionsRouter);

/**
 * 
 */
const file = readFileSync('./swagger-doc.json', 'utf8')
const swaggerDocument = JSON.parse(file);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(process.env.PORT || 3000, () => {
  console.log("Server starting!");
});
