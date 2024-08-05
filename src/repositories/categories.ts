import { Category, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


export async function getCategories(limit: number): Promise<Category[]> {
  const options = {
    take: limit ? limit : undefined
  };

  const categories = await prisma.category.findMany(options);

  return categories;
}

export async function getCategory(id: string): Promise<Category | null> {
  const category = await prisma.category.findFirst({
    where: { id }
  });

  return category;
}
