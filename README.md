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
