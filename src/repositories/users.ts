import { hash } from "bcryptjs";
import { Prisma, PrismaClient, User } from "@prisma/client";

const prisma = new PrismaClient();

type UserWithProfile = Prisma.UserGetPayload<{ include: { profile: true} }>;

// TODO: return users without passwordHash

export async function getUserByEmail(email: string) {

  const user = await prisma.user.findUnique({
    where: { email: email }
  });

  return user;
};

export async function createUser(
  email: string,
  password: string,
  username: string,
  fullname: string,
  photo?: string,
  phone?: string,
  location?: string,
  about?: string,
  availableForCall?: boolean,
) {

  const passwordHash = password ? await hash(password, 10) : null;
  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      profile: {
        create: {
          username,
          fullname,
          photo,
          phone,
          location,
          about,
          availableForCall
        }
      }
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

export async function getUserById(id: string): Promise<UserWithProfile> {
  const user = await prisma.user.findFirstOrThrow({
    where: { id },
    include: {
      profile: true
    }
  });
  return user;
}
