import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();
const users = [
  {
    "email": "Nestor.Kihn91@ya.ru",
    "username": "Nestor",
    "firstname": "Nestor",
    "lastname": "Kihn",
    "birthday": "2023-10-20T00:00:00.000Z",
    "photo": "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/569.jpg",
    "phone": "+7 (154)-664-152",
    "location": "Нигерия",
    "about": "Разработке проект реализация организационной в повышение поэтапного форм не также. Участия равным высшего значимость подготовке повышение социально-ориентированный управление дальнейших значительной. Обучения создание реализация позволяет обществом всего следует следует."
  },
  {
    "email": "Samson.Wehner9@hotmail.com",
    "username": "Samson",
    "firstname": "Samson",
    "lastname": "Wehner",
    "birthday": "2023-10-20T00:00:00.000Z",
    "photo": "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/679.jpg",
    "phone": "+7 (950)-737-483",
    "location": "Аомынь (не признана)",
    "about": "Влечёт же обществом актуальность форм. Управление важную оценить таким нами. Особенности создание же проблем.\nСущности подготовке опыт не качественно принимаемых предпосылки укрепления. Кадров путь оценить для путь кругу управление реализация реализация. Постоянное административных правительством кадровой соображения информационно-пропогандистское влечёт.\nЭксперимент сущности формирования напрямую стороны значительной. Место определения систему вызывает поставленных следует. Богатый работы широкому напрямую способствует обществом отметить понимание."
  },
  {
    "email": "Savvatii_Kovacek47@mail.ru",
    "username": "Savvatii",
    "firstname": "Savvatii",
    "lastname": "Kovacek",
    "birthday": "2023-10-20T00:00:00.000Z",
    "photo": "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/892.jpg",
    "phone": "+7 (171)-097-285",
    "location": "Нидерланды",
    "about": "Позволяет общества в. Воздействия принимаемых современного создаёт сущности существующий стороны. Организации дальнейшее формирования высшего начало отметить модель.\nСоответствующей существующий начало эксперимент. Формированию прогресса дальнейших обуславливает кадровой. Другой идейные что выбранный проблем.\nСистемы воздействия сомнений оценить. Обществом высокотехнологичная обществом. Соображения поэтапного нами предложений базы очевидна активизации создание финансовых."
  },
  {
    "email": "Miron.Tromp@yandex.ru",
    "username": "Miron",
    "firstname": "Miron",
    "lastname": "Tromp",
    "birthday": "2023-10-20T00:00:00.000Z",
    "photo": "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/1245.jpg",
    "phone": "+7 (584)-065-397",
    "location": "Тамил-Илам (не признана)",
    "about": "Качества степени развития. Нами стороны организационной на. Для повышению равным плановых нами.\nС обеспечение способствует и сфера собой значимость порядка. Насущным также предпосылки инновационный направлений ресурсосберегающих значимость кадровой. Прогрессивного также сущности административных выбранный ресурсосберегающих.\nДальнейшее качественно богатый рост. Определения гражданского поэтапного процесс важную требует создаёт административных. Прогрессивного формированию обеспечение широкому кадровой."
  },
  {
    "email": "Kondrat_Krajcik72@yahoo.com",
    "username": "Kondrat",
    "firstname": "Kondrat",
    "lastname": "Krajcik",
    "birthday": "2023-10-20T00:00:00.000Z",
    "photo": "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/402.jpg",
    "phone": "+7 (664)-606-744",
    "location": "Эстония",
    "about": "Внедрения форм кадровой форм роль. Же подготовке влечёт таким общества обществом образом практика таким. Значимость по роль таким."
  },
  {
    "email": "Kseniya_Prosacco@yahoo.com",
    "username": "Kseniya",
    "firstname": "Kseniya",
    "lastname": "Prosacco",
    "birthday": "2023-10-20T00:00:00.000Z",
    "photo": "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/309.jpg",
    "phone": "+7 (703)-694-542",
    "location": "Бразилия",
    "about": "Проект способствует систему особенности кругу модель. Организационной проверки важную плановых. Курс способствует по соображения на эксперимент а качественно. Нашей в концепция различных."
  },
  {
    "email": "Fedot_Batz30@mail.ru",
    "username": "Fedot",
    "firstname": "Fedot",
    "lastname": "Batz",
    "birthday": "2023-10-20T00:00:00.000Z",
    "photo": "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/453.jpg",
    "phone": "+7 (732)-879-848",
    "location": "Суринам",
    "about": "Дальнейшее базы оценить значение обеспечивает соображения структура равным социально-ориентированный. Поставленных для специалистов постоянное роль кадров предложений."
  },
  {
    "email": "Averukyan_Hettinger18@yandex.ru",
    "username": "Averukyan",
    "firstname": "Averukyan",
    "lastname": "Hettinger",
    "birthday": "2023-10-20T00:00:00.000Z",
    "photo": "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/412.jpg",
    "phone": "+7 (464)-134-328",
    "location": "Восточный Тимор",
    "about": "Сознания обществом потребностям сфера социально-ориентированный роль. Воздействия дальнейшее кругу принимаемых не. Обеспечивает работы потребностям задач понимание соответствующей активности равным сомнений. Отметить повседневной проблем формировании представляет сфера отношении гражданского проблем. Постоянное новая целесообразности управление прогресса информационно-пропогандистское поэтапного стороны выполнять."
  },
  {
    "email": "Vlas.Gutmann34@gmail.com",
    "username": "Vlas",
    "firstname": "Vlas",
    "lastname": "Gutmann",
    "birthday": "2023-10-20T00:00:00.000Z",
    "photo": "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/165.jpg",
    "phone": "+7 (785)-679-525",
    "location": "Лаос",
    "about": "Порядка же уточнения национальный процесс.\nПуть рамки забывать равным позволяет.\nСоответствующей качества требует значительной.\nПрактика проект сложившаяся мира эксперимент."
  },
  {
    "email": "Olimpiada_Hegmann83@hotmail.com",
    "username": "Olimpiada",
    "firstname": "Olimpiada",
    "lastname": "Hegmann",
    "birthday": "2023-10-20T00:00:00.000Z",
    "photo": "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/179.jpg",
    "phone": "+7 (705)-316-863",
    "location": "Мозамбик",
    "about": "Начало влечёт для значительной процесс другой административных."
  }
];
const categories = [
  'Psychology',
  'Games',
  'Food',
  'Entertainment',
  'Humor',
];
const defaultPassword = '123456';


async function main() {
  await prisma.category.createMany({
    data: categories.map(c => ({
      title: c
    })),
  });

  const cats = await prisma.category.findMany({});
  let i = 0;
  const c = 3;

  users.forEach(async u => {
    const password = await hash(defaultPassword, 10);
    await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: {
        email: u.email,
        emailVerified: true,
        phone: u.phone,
        phoneVerified: true,
        passwordHash: password,
        profile: {
          create: {
            username: u.username,
            firstname: u.firstname,
            lastname: u.lastname,
            birthday: u.birthday,
            photo: u.photo,
            location: u.location,
            categories: {
              connect: cats.map(c => ({id: c.id}))
            }
          },
        },
      },
    })
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
