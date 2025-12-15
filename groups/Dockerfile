FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./
COPY code/prisma ./prisma

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]