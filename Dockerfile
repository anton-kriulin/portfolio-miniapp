FROM node:latest as builder

WORKDIR /usr/src/app

COPY package*.json ./
#COPY ./secrets ./
COPY .env.local /usr/src/app/.env.local

RUN npm install -g pnpm
RUN pnpm install

COPY . .

RUN pnpm run build

CMD [ "pnpm", "run", "start","-p 4000"]