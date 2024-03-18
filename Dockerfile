FROM node:21-alpine3.18
WORKDIR /app

COPY package.json yarn.lock /app/
RUN yarn install --frozen-lockfile

COPY . /app/

RUN yarn run build && \
  addgroup -S tariff && \
  adduser -S tariff -G tariff && \
  chown -R tariff:tariff /app

ENV PORT=8080

USER tariff

HEALTHCHECK CMD nc -z 0.0.0.0 $PORT

CMD ["yarn", "run", "start"]
