import dotenv from 'dotenv';
import Express from 'express';
import cors from 'cors';
import bodyParser from "body-parser";
import { bootstrap_auth } from './routers/oauth2.js';
import { bootstrap_register } from './routers/register.js';
import { ExtractJwt, Strategy } from "passport-jwt";
import passport from "passport";
import { profileRouter } from './routers/profile.js';
import { UserRepository } from './repositories/user_repository.js';
import { PrismaClient } from '@prisma/client';

const app = Express();

dotenv.config();

app.use(cors())

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

bootstrap_auth(app);
bootstrap_register(app);

const strategyOpts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.OAUTH_CODES_SECRET || "secret",
};
passport.use(
  new Strategy(
    strategyOpts,
    async (payload, done) => {
      console.log("token payload", payload);
      const prisma = new PrismaClient();
      const usersRepositiory = new UserRepository(prisma);
      const user = await usersRepositiory.getUserById(payload.sub);
      if (user)
        return done(null, user);
      return done(new Error("invalid token"));
    }
  )
);

app.use("/users", profileRouter);

const PORT = process.env.NODE_PORT || 3000;
app.listen(PORT);
console.log(`app is listening on http://localhost:${PORT}`);
