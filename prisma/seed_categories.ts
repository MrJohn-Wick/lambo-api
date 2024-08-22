import { PrismaClient } from '@prisma/client';


const prisma = new PrismaClient();
const categories = [
  'Humor',
  'Food',
  'Entertainment',
  'Animals',
  'Music',
  'Travel',
  'Creativity',
  'Movies',
  'Health',
  'Family',
  'Videogames',
  'Beauty',
  'Fashion',
  'Sports',
  'Technology',
  'Dance',
  'Cars',
  'Science',
  'Education',
  'Culture',
  'Buisiness',
];

async function main() {
  await prisma.category.createMany({
    data: categories.map(category => ({ title: category })),
  });
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  });
