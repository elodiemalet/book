FROM node:22-alpine

WORKDIR /app

COPY package.json yarn.lock ./

RUN rm -rf node_modules
RUN yarn --pure-lockfile

COPY . .

EXPOSE 3000 4000

RUN yarn run build

CMD [ "yarn", "run", "start" ]