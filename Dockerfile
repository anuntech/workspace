# Etapa 1: Build do aplicativo Next.js
FROM node:21-alpine AS builder

WORKDIR /app

COPY package.json ./

RUN npm install -g bun

RUN bun install --production

COPY . .

RUN rm -rf .next

RUN bun run build

EXPOSE 3000

CMD ["npm", "run", "start"]
