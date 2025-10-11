FROM node:24-alpine

WORKDIR  /app

COPY ["package*.json ./", "yarn.lock ./"]
RUN yarn

COPY . .
RUN yarn build

CMD ["yarn", "start"]
