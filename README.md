# lambo-api

## How to run Dev

```bash
npm i
npx dotenv-flow npx prisma generate
npx dotenv-flow npx prisma migrate deploy
npx dotenv-flow npm run seed
npm run swagger
npm run dev
```

### If you modify prisma.schema file, plase do this before commit changes

```bash
npx dotenv-flow npx prisma migrate dev
```

## How to deploy on dev server

```bash
./deploy.sh
```

1. npx prisma generate
2. npx prisma db push
3. npm run seed
4. npm run swagger
5. npm install
6. npm run dev
