FROM node:24.7.0

WORKDIR /usr/src/app

COPY code/package*.json ./

RUN npm install

COPY code/prisma ./prisma
COPY code ./ 

COPY . .

RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]