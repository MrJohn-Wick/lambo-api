import { PrismaClient, Session, User } from '@prisma/client';

const prisma = new PrismaClient();

export const sessionsService = {
  create: async (token: string, user: User): Promise<Session | undefined> => {
    const session = await prisma.session.create({
      data: {
        token,
        user_id: user.id,
      }
    });
    return session;
  }
};
