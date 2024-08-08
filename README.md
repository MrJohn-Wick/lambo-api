# lambo-api

## How to run Dev

```bash
npm i
npx dotenv-flow npx prisma generate
npx dotenv-flow npx prisma db push
npx dotenv-flow npm run seed
npm run swagger
npm run dev
```

## How to deploy on dev server

```bash
./deploy.sh
```
