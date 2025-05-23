# Etapa 1: Build do aplicativo Next.js
FROM node:21-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

RUN rm -rf .next

ARG EMAIL_SERVER
ARG GOOGLE_ID
ARG GOOGLE_SECRET
ARG HETZNER_S3_ACCESS_KEY_ID
ARG HETZNER_S3_SECRET_ACCESS_KEY
ARG MAILGUN_API_KEY
ARG MONGODB_URI
ARG NEXTAUTH_SECRET
ARG NEXT_PUBLIC_HETZNER_BUCKET_NAME
ARG STRIPE_PUBLIC_KEY
ARG STRIPE_SECRET_KEY
ARG STRIPE_WEBHOOK_SECRET
ARG HETZNER_S3_REGION
ARG NEXT_PUBLIC_HETZNER_S3_ENDPOINT
ARG NEXTAUTH_URL
ARG JWT_SECRET
ARG STRIPE_PRICE
ARG DOMAIN
ARG ALLOWED_ORIGINS

ENV EMAIL_SERVER=${EMAIL_SERVER}
ENV GOOGLE_ID=${GOOGLE_ID}
ENV GOOGLE_SECRET=${GOOGLE_SECRET}
ENV HETZNER_S3_ACCESS_KEY_ID=${HETZNER_S3_ACCESS_KEY_ID}
ENV HETZNER_S3_SECRET_ACCESS_KEY=${HETZNER_S3_SECRET_ACCESS_KEY}
ENV MAILGUN_API_KEY=${MAILGUN_API_KEY}
ENV MONGODB_URI=${MONGODB_URI}
ENV NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
ENV NEXT_PUBLIC_HETZNER_BUCKET_NAME=${NEXT_PUBLIC_HETZNER_BUCKET_NAME}
ENV STRIPE_PUBLIC_KEY=${STRIPE_PUBLIC_KEY}
ENV STRIPE_SECRET_KEY=${STRIPE_SECRET_KEY}
ENV STRIPE_WEBHOOK_SECRET=${STRIPE_WEBHOOK_SECRET}
ENV HETZNER_S3_REGION=${HETZNER_S3_REGION}
ENV NEXT_PUBLIC_HETZNER_S3_ENDPOINT=${NEXT_PUBLIC_HETZNER_S3_ENDPOINT}  
ENV NEXTAUTH_URL=${NEXTAUTH_URL}
ENV JWT_SECRET=${JWT_SECRET}
ENV STRIPE_PRICE=${STRIPE_PRICE}
ENV DOMAIN=${DOMAIN}
ENV ALLOWED_ORIGINS=${ALLOWED_ORIGINS}

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]
