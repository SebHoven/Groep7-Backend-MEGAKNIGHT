FROM node:24.7.0

WORKDIR /usr/src/app

# 1. Copy package.json & tsconfig.json first (caching layer)
COPY code/package*.json ./
COPY code/tsconfig.json ./

# 2. Install dependencies
RUN npm install

# 3. Copy Prisma schema + migrations
COPY code/prisma ./prisma

# 4. Generate Prisma client
# Explicitly tell Prisma where schema is to avoid "schema not found" errors
RUN npx prisma generate --schema ./prisma/schema.prisma

# 5. Copy TypeScript source code
COPY code/src ./src

# 6. Build TypeScript
RUN npm run build

# 7. Expose port & run
EXPOSE 3000
CMD ["npm", "start"]
