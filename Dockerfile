# Base image with dependencies
FROM node:20-alpine

WORKDIR /app

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV NEXT_TELEMETRY_DISABLED=1

COPY package*.json ./
RUN npm install --frozen-lockfile

COPY . .

RUN --mount=type=secret,id=_env cat /run/secrets/_env > .env

RUN npm run standalone

# Production runner
FROM alpine:3.20
RUN apk update && apk add --no-cache nodejs icu-data-full
RUN addgroup -S node && adduser -S node -G node
USER node
RUN mkdir /home/node/code && chown -R node:node /home/node/code
WORKDIR /home/node/code
COPY --from=0 /app/.next/standalone .

EXPOSE 3000
CMD [ "node", "server.js" ]