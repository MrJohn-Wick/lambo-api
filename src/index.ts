import bodyParser from 'body-parser';
import express, { Request, Response } from 'express';
import passport from 'passport';
import { authController } from './controllers/auth';
import { oauthServer } from './passport';
import { profileController } from './controllers/profile';


const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.json({
    status: "Ok"
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
  '/me',
  passport.authenticate('bearer', { session: false }),
  profileController.me
);

app.listen(process.env.PORT || 3000, () => {
  console.log("Server starting!");
});
