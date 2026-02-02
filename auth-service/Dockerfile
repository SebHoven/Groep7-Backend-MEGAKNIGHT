FROM node:18-alpine

WORKDIR /app

# Copy package files FIRST (from code/)
COPY code/package*.json ./
COPY code/tsconfig.json ./

# Install dependencies
RUN npm install

# Copy rest of the source
COPY code .

# Prisma
RUN npx prisma generate

# Build
RUN npm run build

EXPOSE 3015

CMD ["npm", "start"]
