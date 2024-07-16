import { PrismaClient } from "@prisma/client";
import express, { Express } from "express";
import { AuthorizationServer, DateInterval } from "@jmondi/oauth2-server";
import { handleExpressError, handleExpressResponse } from "@jmondi/oauth2-server/express";

// import { AuthCodeRepository } from "./repositories/auth_code_repository.js";
import { ClientRepository } from "../repositories/client_repository.js";
import { ScopeRepository } from "../repositories/scope_repository.js";
import { TokenRepository } from "../repositories/token_repository.js";
import { UserRepository } from "../repositories/user_repository.js";
import { MyCustomJwtService } from "../utils/custom_jwt_service.js";

export async function bootstrap_auth(app: Express) {
  const prisma = new PrismaClient();
  // const authCodeRepository = new AuthCodeRepository(prisma);
  const userRepository = new UserRepository(prisma);

  const authorizationServer = new AuthorizationServer(
    new ClientRepository(prisma),
    new TokenRepository(prisma),
    new ScopeRepository(prisma),
    new MyCustomJwtService(process.env.OAUTH_CODES_SECRET as string),
  );
  authorizationServer.enableGrantTypes(
    { grant: "password", userRepository: userRepository },
    // ["client_credentials", new DateInterval("1d")],
    ["refresh_token", new DateInterval("30d")],
    // { grant: "authorization_code", authCodeRepository, userRepository },
  );

  app.get("/authorize", async (req: express.Request, res: express.Response) => {
    console.log('Authorize');
    try {
      // Validate the HTTP request and return an AuthorizationRequest object.
      const authRequest = await authorizationServer.validateAuthorizationRequest(req);

      // The auth request object can be serialized and saved into a user's session.
      // You will probably want to redirect the user at this point to a login endpoint.

      // Once the user has logged in set the user on the AuthorizationRequest
      console.log("Once the user has logged in set the user on the AuthorizationRequest");
      authRequest.user = { id: "abc", email: "user@example.com" };

      // At this point you should redirect the user to an authorization page.
      // This form will ask the user to approve the client and the scopes requested.

      // Once the user has approved or denied the client update the status
      // (true = approved, false = denied)
      authRequest.isAuthorizationApproved = true;

      // Return the HTTP redirect response
      const oauthResponse = await authorizationServer.completeAuthorizationRequest(authRequest);
      return handleExpressResponse(res, oauthResponse);
    } catch (e) {
      handleExpressError(e, res);
    }
  });

  app.post("/token", async (req: express.Request, res: express.Response) => {
    console.log('token');
    try {
      const oauthResponse = await authorizationServer.respondToAccessTokenRequest(req);
      console.log(oauthResponse);
      return handleExpressResponse(res, oauthResponse);
    } catch (e) {
      res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }
  });

  app.post("/token/revoke", async (req: express.Request, res: express.Response) => {
    console.log("Token revoke");
    try {
      const oauthResponse = await authorizationServer.revoke(req);
      console.log('OK');
      return handleExpressResponse(res, oauthResponse);
    } catch (e) {
      console.log('error');
      handleExpressError(e, res);
      return;
    }
  });
}
