import { Category, Prisma, PrismaClient } from "@prisma/client";
import { ListenOptions } from 'net';

const prisma = new PrismaClient();


interface ListOptions {
  userId?: string;
  limit?: number;
};

export async function getCategories(options: ListOptions): Promise<Category[]> {
  let prismaOptions: Prisma.CategoryFindManyArgs = {};

  if (options.userId) {
    prismaOptions.where = {
      profiles: {
        some: {
          userId: options.userId
        }
      }
    }
  };

  const categories = await prisma.category.findMany(prismaOptions);

  return categories;
}

export async function getCategoriesByIds(ids: string[]): Promise<Category[]> {
  const categories = await prisma.category.findMany({
    where: {
      id: {
        in: ids
      }
    }
  });

  return categories;
}

export async function getCategory(id: string): Promise<Category | null> {
  const category = await prisma.category.findFirst({
    where: { id }
  });

  return category;
}
