import passport from 'passport';
import { Strategy as BearerStrategy } from 'passport-http-bearer';
import { generateToken, isValidToken } from './utils/auth';
import { getAccessToken, storeTokens } from './repositories/tokens';
import { createUser, getUserByEmail } from './repositories/users';
import { Issuer } from 'openid-client';
import { User } from '@prisma/client';

declare global {
  namespace Express {
    interface User {
      id: string;
    }
  }
}

// export const oauthServer = oauth2orize.createServer();
const accessTokenLifetime = 60 * 60 * 1000; //one hour

export async function getTokens(user: User) {
  const accessToken = generateToken();
  const refreshToken = generateToken();
  const expiresAt = new Date(new Date().getTime() + accessTokenLifetime);
  await storeTokens(user, accessToken, refreshToken, expiresAt);
  return { accessToken, refreshToken, expiresAt }
}

passport.use(new BearerStrategy(async (token: string, done) => {
  const storedToken = await getAccessToken(token);
  if ( storedToken && isValidToken(storedToken)) {
    return done(null, storedToken.user as User);
  }
  return done(null, false);
}));

passport.use('google-token', new BearerStrategy( async (token: string, done) => {
  console.log("Google authorization");
  const googleIssuer = await Issuer.discover('https://accounts.google.com');
  const client = new googleIssuer.Client({
    client_id: '856788290766-7m656jj3ppsfr2flr3blotasu59lpupj.apps.googleusercontent.com',
  });
  
  const userInfo = await client.userinfo(token);

  if (userInfo.email) {
    try {
      const user = await getUserByEmail(userInfo.email);

      if (user) {
        return done(null, user);
      }

      // TODO: create profile from google account
      // const newUser = await createUser(userInfo.email);
     
      // return done(null, newUser);
      return done(null, false);
    } catch (error) {
      done(error, false); 
    }
  }
  return done(null, false);
}));
