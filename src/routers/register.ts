import express, { Express } from "express";
import { UserRepository } from "../repositories/user_repository.js";
import { PrismaClient } from '@prisma/client';


export async function bootstrap_register(app: Express) {
  // const authCodeRepository = new AuthCodeRepository(prisma);
  
  app.post("/register", async (req: express.Request, res: express.Response) => {
    console.log("Register new user");
    //TODO: input data validating

    const { email, password, firstname, lastname, birthday } = req.body;
    const prisma = new PrismaClient();
    const userRepository = new UserRepository(prisma);
    try {
      const user = await userRepository.registerNewUser(email, password, firstname, lastname, birthday);
      res.json({
        success: true,
        user,
      });
    } catch (error) {
      res.json({
        error: true,
        message: (error as Error).message
      });
    }
  });
}
