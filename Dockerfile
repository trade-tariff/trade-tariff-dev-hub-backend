FROM node:21-alpine3.18
WORKDIR /app

COPY package.json yarn.lock /app/
RUN yarn install --frozen-lockfile

COPY . /app/

RUN yarn run build
RUN addgroup -S tariff
RUN adduser -S tariff -G tariff
RUN chown -R tariff:tariff /app
RUN apk add --no-cache netcat-openbsd

ENV PORT=8080 \
  NODE_ENV=production

USER tariff

HEALTHCHECK CMD nc -z 0.0.0.0 $PORT

CMD ["yarn", "run", "start"]
