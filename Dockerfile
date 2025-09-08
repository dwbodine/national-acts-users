# Base image with dependencies
FROM node:22-bookworm-slim AS base

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV NEXT_PUBLIC_SERVICE_URL=http://localhost:5000
ENV NEXT_PUBLIC_CONFIGURATION=dev
ENV NEXT_PUBLIC_WWW_URL=http://localhost:4000

USER root
RUN apt-get update && apt-get install -y --no-install-recommends \
  libc6-dev \
  libvips-dev \
  build-essential \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install --frozen-lockfile

# Build the Next.js app
FROM node:22-bookworm-slim AS builder
WORKDIR /app
COPY --from=base /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# Production runner
FROM node:22-bookworm-slim AS runner
WORKDIR /app
ENV NODE_ENV=production

# Create a non-root user
RUN addgroup --system --gid 1001 nextjs \
  && adduser --system --uid 1001 nextjs

# Copy necessary files from builder
COPY --from=builder --chown=nextjs:nextjs /app/public ./public
COPY --from=builder --chown=nextjs:nextjs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nextjs /app/.next/static ./.next/static

USER nextjs

# Ensure node can find binaries
ENV PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/app/node_modules/.bin

EXPOSE 3000

# Run the standalone server
CMD ["node", "server.js"]
