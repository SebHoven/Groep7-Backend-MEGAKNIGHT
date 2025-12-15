FROM node:24.7.0

WORKDIR /usr/src/app

COPY code/package*.json ./
COPY code/prisma ./prisma

RUN npm install

COPY code/src ./src

COPY . .

RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]