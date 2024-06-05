import { Prisma, PrismaClient, User } from "@prisma/client";

const prisma = new PrismaClient();

type UserCreateParameters = Omit<User, "id">;

export default {
  create: async (params: UserCreateParameters) => {
    const user: Prisma.UserCreateInput = params;
    const createdUser = await prisma.user.create({ data: user });
    return createdUser;
  }
};
