# Base image with dependencies
FROM node:alpine

WORKDIR /app

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV NEXT_TELEMETRY_DISABLED=1

COPY package.json ./
COPY yarn.lock ./
RUN yarn install

COPY . .

RUN --mount=type=secret,id=_env cat /run/secrets/_env > .env

RUN yarn standalone

# Production runner
FROM alpine:latest
RUN apk update && apk add --no-cache nodejs icu-data-full
RUN addgroup -S node && adduser -S node -G node
USER node
RUN mkdir /home/node/code && chown -R node:node /home/node/code
WORKDIR /home/node/code
COPY --from=0 /app/.next/standalone .

EXPOSE 3000
CMD [ "node", "server.js" ]