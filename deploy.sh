#!/bin/bash

git pull --rebase

npm i

npx dotenv-flow npx prisma generate
npx dotenv-flow npx prisma migrate deploy
# uncomment next line if you need to create mock data
# npx dotenv-flow npm run seed/categories
# npx dotenv-flow npm run seed

npx dotenv-flow npm run swagger

npx dotenv-flow npm run build

systemctl restart lambo-api.service
