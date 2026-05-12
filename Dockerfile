FROM node:20-bookworm-slim

RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc libc6-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY prisma ./prisma
RUN ./node_modules/.bin/prisma generate

COPY . .
RUN npm run build

EXPOSE 3000

CMD prisma db push --skip-generate && npm start -- -p 3000
