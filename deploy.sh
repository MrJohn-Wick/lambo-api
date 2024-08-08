#!/bin/bash

git pull --rebase

npm i

npx dotenv-flow npx prisma generate
npx dotenv-flow npx prisma db push
npx dotenv-flow npm run seed

npm run swagger

npm run build

systemctl restart lambo-api.service
