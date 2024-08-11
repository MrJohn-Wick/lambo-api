// import { hash } from 'bcryptjs';
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

/* */
export async function getSubscriptionByUserAndAuthor(userId: string, authorId: string) {
  const sub = await prisma.subscription.findFirst({
    where: {
      user_id: authorId,
      subscriber_id: userId
    }
  });

  return sub;
}

/* */
export async function getSubscribtionsByUser(userId: string) {
  const subscriptions = await prisma.subscription.findMany({
    where: {
      subscriber_id: userId
    },
    include: {
      user: {
        include: {
          profile: true
        }
      }
    }
  });

  return subscriptions;
}
