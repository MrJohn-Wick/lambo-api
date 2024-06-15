import { usersService } from "@lambo/services/users";
import { body } from "express-validator";
import { CustomValidation } from "express-validator/lib/context-items";

CustomValidation;
const emailValidator = body("email")
  .notEmpty()
  .custom((value: any) => {
    console.log("check email", value);
    return usersService.getByEmail(value).then((user) => {
      if (user) {
        return Promise.reject("E-mail alredy in use.");
      }
    });
  });

const passwordValidator = body("password").notEmpty().isString();

export const signupValidator = [emailValidator, passwordValidator];
