import { Prisma, PrismaClient, User } from "@prisma/client";

const prisma = new PrismaClient();

export default {
  create: async (email: string, phone: string | null, first_name: string | null, last_name: string | null, date_of_birth: Date) => {
    let user: Prisma.UserCreateInput;
    user = {
      email,
      phone,
      first_name,
      last_name,
      date_of_birth,
    }
    const createdUser = await prisma.user.create({ data: user });
    return createdUser;
  }
};
