FROM node:19.3.0-alpine3.17

RUN mkdir /app

COPY . /app

WORKDIR /app

RUN npm install

EXPOSE 8080