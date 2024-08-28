import { hash } from "bcryptjs";
import { Prisma, PrismaClient, User } from "@prisma/client";
import { getOnetimeCode } from '../utils/auth';

const prisma = new PrismaClient();

type UserWithProfile = Prisma.UserGetPayload<{ include: { profile: true} }>;

// TODO: return users without passwordHash

export async function getUserByEmail(email: string): Promise<User | null> {
  const query = Prisma.sql`SELECT * FROM users WHERE lower(email)=lower(${email})`;
  const users = await prisma.$queryRaw<User[]>(query);

  return users.length ? users[0] : null;
};

export async function getUserByPhone(phone: string) {
  const user = await prisma.user.findUnique({
    where: { phone }
  });

  return user;
};

export async function createUser(
  email: string,
  phone: string,
) {

  // const passwordHash = password ? await hash(password, 10) : null;
  const user = await prisma.user.create({
    data: {
      email,
      phone
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

export async function getUserById(id: string): Promise<User> {
  const user = await prisma.user.findFirstOrThrow({
    where: { id },
  });

  return user;
}

export async function verifyPhone(userId: string) {
  await prisma.user.update({
    where: { id: userId },
    data: {
      phoneVerified: true
    }
  });
}

export async function updateUserPassword(userId: string, password: string) {
  const passwordHash = password ? await hash(password, 10) : null;

  await prisma.user.update({
    where: { id: userId },
    data: {
      passwordHash
    }
  })
}
