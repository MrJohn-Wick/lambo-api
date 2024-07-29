import { hash } from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function createSubscribe(userId: string, subscriberId: string) {

  const subscribe = await prisma.subscription.create({
    data: {
      user_id: userId,
      subscriber_id: subscriberId
    }
  });

  return subscribe;
}

export async function getUserSubscriptions(userId: string, subscriberId: string) {

  const subscribe = await prisma.subscription.create({
    data: {
      user_id: userId,
      subscriber_id: subscriberId
    }
  });

  return subscribe;
}
