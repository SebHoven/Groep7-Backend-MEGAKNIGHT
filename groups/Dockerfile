FROM node:24.7.0

WORKDIR /usr/src/app

# 1. Copy package.json & tsconfig.json first
COPY code/package*.json ./
COPY code/tsconfig.json ./

# 2. Install dependencies
RUN npm install

# 3. Copy Prisma schema + migrations
COPY code/prisma ./prisma

# 4. Generate Prisma client
RUN npx prisma generate

# 5. Copy TS source code
COPY code/src ./src

# 6. Build TypeScript
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]