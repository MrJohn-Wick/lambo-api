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
    
    const {
      email,
      password,
      username,
      fullname,
      phone,
      photo,
      location,
      about,
      availableForCall,
    } = validatedValues.data;
    
    const user = await getUserByEmail(username);
    
    if (user) {
      return res.json({
        error: true,
        message: "Email is alredy used"
      });
    }

    const newUser = await createUser(
      email,
      password,
      username,
      fullname,
      photo,
      phone,
      location,
      about,
      availableForCall
    );

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
