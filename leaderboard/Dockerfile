FROM node:24.7.0

WORKDIR /usr/src/app

# Copy package files first
COPY code/package*.json ./
COPY code/tsconfig.json ./

RUN npm install

# Copy all code
COPY code ./

# Prisma client
RUN npx prisma generate --schema ./prisma/schema.prisma

# Build TS
RUN npm run build

# Create sqlite directory
RUN mkdir -p /db && chmod 777 /db

EXPOSE 3017

# Startup script
RUN echo '#!/bin/sh\n\
echo "Resetting database..."; \n\
npx prisma migrate reset --force --schema ./prisma/schema.prisma; \n\
echo "Seeding database..."; \n\
npx prisma db seed --schema ./prisma/schema.prisma; \n\
echo "Starting server..."; \n\
node dist/start.js\n' > /usr/src/app/start.sh && chmod +x /usr/src/app/start.sh

CMD ["/usr/src/app/start.sh"]
