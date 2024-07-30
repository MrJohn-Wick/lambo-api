import { compare } from 'bcryptjs';
import oauth2orize from 'oauth2orize';
import passport from 'passport';
import { Strategy as BearerStrategy, Strategy } from 'passport-http-bearer';
import { generateToken, isValidToken } from './utils/auth';
import { deleteRefreshToken, getAccessToken, getRefreshToken, storeTokens } from './repositories/tokens';
import { createUser, getUserByEmail } from './repositories/users';
import { Issuer } from 'openid-client';
import { User } from '@prisma/client';


export const oauthServer = oauth2orize.createServer();
const accessTokenLifetime = 60 * 60 * 1000; //one hour

oauthServer.exchange(
  oauth2orize.exchange.password(async (client, username, passport, scope, done) => {
    console.log('Search user', username);
    const user = await getUserByEmail(username);
    
    if (user && user.passwordHash && await compare(passport, user.passwordHash)) {
      const accessToken = generateToken();
      const refreshToken = generateToken();
      const expiresAt = new Date(new Date().getTime() + accessTokenLifetime);
      await storeTokens(user, accessToken, refreshToken, expiresAt);
      return done(null, accessToken, refreshToken, {expires_in: expiresAt});
    }

    return done(new Error('User not found'));
  })
);

oauthServer.exchange(oauth2orize.exchange.refreshToken(async (client, refreshToken, scope, done) => {
  console.log(client, refreshToken);
  const token = await getRefreshToken(refreshToken);
  console.log(token);
  
  if (token && isValidToken(token)) {
    deleteRefreshToken(refreshToken);

    const aToken = generateToken();
    const rToken = generateToken();
    const expiresAt = new Date(new Date().getTime() + accessTokenLifetime);
    await storeTokens(token.user, aToken, rToken, expiresAt);
    return done(null, aToken, rToken, { expires_in: expiresAt });
  }

  return done(null, false);
}));

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

      const newUser = await createUser(userInfo.email);
      
      return done(null, newUser);
    } catch (error) {
      done(error, false); 
    }
  }
  return done(null, false);
}));
