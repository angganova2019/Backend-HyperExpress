FROM node:16.17.0-slim

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . ./

EXPOSE 3030

CMD npm run start