import bcrypt from 'bcrypt';
import 'module-alias/register';
import express, { Express } from 'express';
import dotenvFlow from 'dotenv-flow';
import userRouter from '@lambo/routes/users';
import authRouter from '@lambo/routes/auth';
import { swaggerDocs } from '@lambo/routes/swagger';
import { ExpressAuth } from '@auth/express';
import Credentials from "@auth/express/providers/credentials";
import { LoginSchema } from '@lambo/schemas/login';
import { usersService } from '@lambo/services/users';


dotenvFlow.config();

const app: Express = express();
const port = Number(process.env.PORT) || 3000;

app.use(express.json());

app.set("trust proxy", true);
app.use("/auth/*", ExpressAuth({ 
  providers: [
    Credentials({
      // authorize: async (credentials) => {
      //   const validatedFields = LoginSchema.safeParse(credentials);

      //   if (!validatedFields.success) return null;

      //   const { email, password } = validatedFields.data;
      //   const user = await usersService.getByEmail(email);

      //   if (!user) return null;

      //   const passwordMatch = await bcrypt.compare(password, user.password);
      //   if (passwordMatch) return user;

      //   return null;
      // }
    })
  ] 
}));

app.use('/', authRouter);

app.use('/user', userRouter
  // #swagger.tags = ['Users']
);

app.listen(port, () => {
  console.log(`API is listening on port ${port}`);
  swaggerDocs(app, port);
});
