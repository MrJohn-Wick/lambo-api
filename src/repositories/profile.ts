import { Prisma, PrismaClient, Profile } from '@prisma/client';
import z from 'zod';
import { ProfileUpdateSchema } from '../schemas/profile';

const prisma = new PrismaClient();

export async function getProfiles(options: any) {
  let where: Prisma.ProfileWhereInput = {};
  if (options.search) {
    where.username = {
      search: `${options.search}*`
    }
    where.firstname = {
      search: `${options.search}*`
    }
    where.lastname = {
      search: `${options.search}*`
    }
  }

  let include: Prisma.ProfileInclude = {};
  if (options.gallery) {
    include.gallery = true;
  }
  if (options.user) {
    include.user = true;
  }

  let orderBy: Prisma.ProfileOrderByWithRelationInput = {};
  if (options.sort) {
    const parts = (options.sort as string).split(':');
    const field = parts[0];
    const direction = parts[1] ? (parts[1] == 'desc' ? 'desc': 'asc') : 'asc';
    orderBy = {[field]: direction};
  }

  const profiles = await prisma.profile.findMany({
    where,
    take: options.limit,
    include: include,
    orderBy,
  });

  return profiles;
}

export async function getProfileByUserId(id: string): Promise<Profile | null> {
  const profile = await prisma.profile.findFirst({
    where: { userId : id },
    include: {
      gallery: true
    }
  });

  if (profile && !profile?.gallery) {
    await prisma.profile.update({
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
