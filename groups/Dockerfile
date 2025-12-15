FROM node:24.7.0

WORKDIR /usr/src/app

COPY code/package*.json ./

RUN npm install

COPY code/src ./src

COPY code/tests ./tests

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]