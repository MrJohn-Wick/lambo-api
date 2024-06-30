import * as LocalStrategy from 'passport-local';
import { Express, NextFunction, Request, Response } from 'express';
import passport from 'passport';

export function initPassport(app: Express) {
  app.use(passport.initialize());
  app.use(passport.authenticate('session'));

  passport.use(new LocalStrategy.Strategy(
    { usernameField: "email" },
    async (email, password, done) => {
      console.log("Passport");
      try {
        if (!email || !passport) { done(null, false, { message: "Invalid fields" }) }
        // const user = usersDB.findUser(email);
        if (email === "ashibeko@gmail.com" && password === "123456") {
          done(null, {
            id: '1',
            email: 'ashibeko@gmail.com',
            roles: ['admin']
          });
        } else {
          done(null, false, { message: "Invalid credentials" });
        }
      } catch (e) {
        done(e);
      }
    }
  ));

  passport.serializeUser((req: Request, user: any, done: any) => {
    done(null, user);
  });
  
  passport.deserializeUser((user: any, done) => {
    done(null, user);
  });
}

export function isAuthenticated(req: Request ,res: Response, next: NextFunction): Response | void {
  if(req.user) {
    return next();
  } else {
    res.status(401).json({
      error: "Unauthenticated"
    })
  }
}

export function isAnonymous(req: Request ,res: Response, next: NextFunction): Response | void {
  if (!req.user) {
    return next();
  } else {
    res.json({
      error: "Alredy authenticated"
    })
  }
}
