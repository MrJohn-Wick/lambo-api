import { Request, Response } from "express";
import { SignUpSchema } from "../schemas/signup";
import { createUser, getUserByEmail } from "../repositories/users";

export const authController = {
  async signUp(req: Request, res: Response) {
    
    const validatedValues = SignUpSchema.safeParse(req.body);
    
    if (!validatedValues.success) {
      return res.json({
        error: true,
        message: "Invalid credentials: " + validatedValues.error        
      });
    }
    
    const { username, password } = validatedValues.data;
    const user = await getUserByEmail(username);
    
    if (user) {
      return res.json({
        error: true,
        message: "Email is alredy used"
      });
    }

    const newUser = await createUser(username, password);

    if (newUser) {
      return res.json({
        success: true,
      });
    }

    return {
      error: true,
      message: "Something went wrong."
    }
  }
};
