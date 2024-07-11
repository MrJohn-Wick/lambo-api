import express, { Express } from "express";
import { UserRepository } from "../repositories/user_repository.js";
import { PrismaClient } from '@prisma/client';

export async function bootstrap_register(app: Express) {
  const prisma = new PrismaClient();
  // const authCodeRepository = new AuthCodeRepository(prisma);
  const userRepository = new UserRepository(prisma);
  
  app.post("/register", async (req: express.Request, res: express.Response) => {
    console.log("Register new user");
    const { email, password } = req.body;
    const user = await userRepository.registerNewUser( email, password );
    res.json({
      success: !!user,
    });
  });
}
