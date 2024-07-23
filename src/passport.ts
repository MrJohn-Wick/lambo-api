import { compare } from 'bcryptjs';
import oauth2orize from 'oauth2orize';
import passport from 'passport';
import { Strategy as BearerStrategy } from 'passport-http-bearer';
import { generateToken, isValidToken } from './utils/auth';
import { deleteRefreshToken, getAccessToken, getRefreshToken, storeTokens } from './repositories/tokens';
import { getUserByEmail } from './repositories/users';


export const oauthServer = oauth2orize.createServer();
const accessTokenLifetime = 60 * 60 * 1000; //one hour

oauthServer.exchange(
  oauth2orize.exchange.password(async (client, username, passport, scope, done) => {
    console.log('Search user');
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
    done(null, aToken, rToken, { expires_in: expiresAt });
  }
  done(null, false);
}));

passport.use(new BearerStrategy(async (token: string, done) => {
  const storedToken = await getAccessToken(token);
  console.log(storedToken);
  if ( storedToken && isValidToken(storedToken)) {
    done(null, storedToken.user);
  }
  done(null, false);
}));
