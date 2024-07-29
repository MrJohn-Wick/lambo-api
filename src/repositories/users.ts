import { hash } from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getUserByEmail(email: string) {

  const user = await prisma.user.findUnique({
    where: { email: email }
  });

  return user;
};

export async function createUser(email: string, password?: string) {

  const passwordHash = password ? await hash(password, 10) : null;
  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
    }
  });

  return user;
}

export async function getUsers(limit: number) {
  const users = await prisma.user.findMany({
    take: limit
  });
  return users;
}
