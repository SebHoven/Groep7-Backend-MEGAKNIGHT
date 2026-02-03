# Use Node 24 LTS
FROM node:24.7.0

# Set working directory
WORKDIR /usr/src/app

# ------------------------------
# 1. Copy package.json & tsconfig.json first for caching
# ------------------------------
COPY code/package*.json ./
COPY code/tsconfig.json ./

# ------------------------------
# 2. Install dependencies
# ------------------------------
RUN npm install

# ------------------------------
# 3. Copy Prisma schema + migrations
# ------------------------------
COPY code/prisma ./prisma

# ------------------------------
# 4. Generate Prisma client
# ------------------------------
RUN npx prisma generate --schema ./prisma/schema.prisma

# ------------------------------
# 5. Copy TypeScript source code
# ------------------------------
COPY code/src ./src

# ------------------------------
# 6. Build TypeScript
# ------------------------------
RUN npm run build

# ------------------------------
# 7. Copy .env file (voor runtime)
# ------------------------------
COPY code/.env ./

# ------------------------------
# 8. Expose leaderboard port
# ------------------------------
EXPOSE 3017

# ------------------------------
# 9. Create startup script (zonder seed)
# ------------------------------
RUN echo '#!/bin/sh\n\
echo "Running Prisma migrations..."\n\
npx prisma migrate deploy --schema ./prisma/schema.prisma\n\
echo "Generating Prisma client..."\n\
npx prisma generate --schema ./prisma/schema.prisma\n\
echo "Starting leaderboard server..."\n\
node dist/start.js\n' > /usr/src/app/start.sh && chmod +x /usr/src/app/start.sh

# ------------------------------
# 10. Run startup script
# ------------------------------
CMD ["/usr/src/app/start.sh"]
