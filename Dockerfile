# Etapa 1: Build do aplicativo Next.js
FROM node:21-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install --production

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]
