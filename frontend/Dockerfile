FROM node:24-alpine

WORKDIR  /app

COPY package*.json ./
RUN yarn

COPY . .
RUM build

CMD ["yarn", "start"]
