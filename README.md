# lambo-api

## How to run:

1. npm i
2. create .env.prod file
3. setup DATABASE_URL variable
4. npx dotenv -c prod -- prisma db push
5. npx dotenv -c prod -- npm run start

## With Docker

1. docker-compose up
2. npx dotenv -c local -- prisma db push
3. npx dotenv -c local -- npm run dev
