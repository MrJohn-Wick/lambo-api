import { Prisma, PrismaClient, User } from "@prisma/client";

const prisma = new PrismaClient();

export default {
  create: async (params: Prisma.UserCreateInput) => {
    const user: Prisma.UserCreateInput = params;
    const createdUser = await prisma.user.create({ data: user });
    return createdUser;
  },

  getAll: async (): Promise<User[]> => {
    const users = prisma.user.findMany()
    return users;
  },

  get: async (id:string): Promise<User | null> => {
    const user: User | null = await prisma.user.findUnique({
      where: {
        id
      }
    });
    return user;
  },

  update: async (id: string, params: Prisma.UserCreateInput): Promise<User> => {
    const user = await prisma.user.update({
      where: {
        id,
      },
      data: params
    });
    return user;
  },

  delete: async (id: string) => {
    await prisma.user.delete({
      where: {
        id
      }
    });
  }
};
