import bcrypt from 'bcrypt';
import { Prisma, PrismaClient, User } from "@prisma/client";

const prisma = new PrismaClient();

const create = async (params: Prisma.UserCreateInput): Promise<User | null> => {
  try {    
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(params.password, salt);
    const user: Prisma.UserCreateInput = {
      ...params,
      password: hash,
    };
    const createdUser = await prisma.user.create({ data: user });
    return createdUser;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const getAll = async (): Promise<User[]> => {
  const users = prisma.user.findMany()
  return users;
};

const get = async (id:string): Promise<User | null> => {
  const user: User | null = await prisma.user.findUnique({
    where: {
      id
    }
  });
  return user;
};

const getByEmail = async (email:string): Promise<User | null> => {
  const user: User | null = await prisma.user.findUnique({
    where: {
      email
    }
  });
  return user;
};

const update = async (id: string, params: Prisma.UserCreateInput): Promise<User> => {
  const user = await prisma.user.update({
    where: {
      id,
    },
    data: params
  });
  return user;
};

const delUser = async (id: string) => {
  await prisma.user.delete({
    where: {
      id
    }
  });
};

export default {
  create,
  getAll,
  get,
  getByEmail,
  update,
  delete: delUser,
};
