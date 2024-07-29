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
import { subscriptionController } from './controllers/subscribtion';


const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.json({
    status: "Server ok"
  });
});

app.post(
  '/signup',
  authController.signUp
);

app.post(
  '/oauth/token',
  oauthServer.token(),
  oauthServer.errorHandler()
);

app.get(
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
  '/me',
  passport.authenticate('bearer', { session: false }),
  profileController.me
);

app.get(
  '/users/available-for-call',
  passport.authenticate('bearer', { session: false }),
  profileController.availableForCall
);

app.post(
  '/users/subscribe',
  passport.authenticate('bearer', { session: false }),
  subscriptionController.create
);

app.listen(process.env.PORT || 3000, () => {
  console.log("Server starting!");
});
