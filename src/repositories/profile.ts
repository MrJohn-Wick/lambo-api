import { PrismaClient, Profile } from '@prisma/client';
import z from 'zod';
import { ProfileUpdateSchema } from '../schemas/profile';

const prisma = new PrismaClient();

export async function getProfileByUserId(id: string): Promise<Profile | null> {
  const profile = await prisma.profile.findFirst({
    where: { userId : id },
    include: {
      gallery: true
    }
  });

  if (profile && !profile?.gallery) {
    prisma.profile.update({
      where: {
        id: profile.id
      },
      data: {
        gallery: {
          create: {}
        }
      }
    });

    return await prisma.profile.findFirst({
      where: { userId : id },
      include: {
        gallery: true
      }
    });
  }

  return profile;
}

export async function updateProfile(userId: string, data: z.infer<typeof ProfileUpdateSchema>) {

  type DataWithoutCategories = Omit<typeof data, 'categories'>;

  const categories = data.categories ? data.categories.map(i => ({id: i})) : [];
  delete data.categories;
  const upsertData: DataWithoutCategories = data;

  await prisma.profile.upsert({
    where: { userId },
    create: {
      userId,
      categories: {
        connect: categories
      },
      gallery: {
        create: {}
      },
      ...upsertData
    },
    update: {
      categories: {
        set: categories
      },
      ...upsertData
    },
  });
}

export async function updateAvatar(userId: string, value: string) {
  await prisma.profile.upsert({
    where: {
      userId: userId
    },
    create: {
      userId,
      avatar: value
    },
    update: {
      avatar: value
    }
  });
}
