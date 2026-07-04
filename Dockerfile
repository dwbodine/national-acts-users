# ---------------------------------------------------------
# 1) BUILDER STAGE — install deps, build Next.js standalone
# ---------------------------------------------------------
FROM node:26-alpine AS builder

# Enable Yarn 4.17.0
RUN npm install -g corepack && corepack enable && corepack prepare yarn@4.17.0 --activate

WORKDIR /app

# Copy only files Yarn needs to perform a correct install
COPY package.json yarn.lock ./
COPY .yarnrc.yml ./
COPY .yarn ./.yarn
COPY tsconfig.json ./
COPY next.config.js ./

# Install dependencies (cached unless dependencies change)
RUN yarn install --immutable

# Now copy the full application code
COPY . .

# Load secrets into .env during build
RUN --mount=type=secret,id=_env cat /run/secrets/_env > .env

# Build Next.js + standalone server
RUN yarn standalone


# ---------------------------------------------------------
# 2) RUNTIME STAGE — small, secure, minimal dependencies
# ---------------------------------------------------------
FROM node:26-alpine AS runner

# Add ICU for full Intl support
RUN apk add --no-cache icu-data-full

USER node
WORKDIR /home/node/app

# Copy standalone server + public assets
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/public ./public

# Runtime environment vars
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV NEXT_TELEMETRY_DISABLED=1

EXPOSE 3000

CMD ["node", "server.js"]
