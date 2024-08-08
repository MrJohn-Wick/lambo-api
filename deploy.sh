#!/bin/bash

git pull --rebase

npm i

npx dotenv-flow npx prisma generate
npx dotenv-flow npx prisma migrate deploy
# uncomment next line if you need to create mock data
# npx dotenv-flow npm run seed

npm run swagger

npm run build

systemctl restart lambo-api.service
