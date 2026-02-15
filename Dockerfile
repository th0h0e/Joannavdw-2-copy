# Build stage
FROM oven/bun:1 AS builder

WORKDIR /app

# Copy package files
COPY package.json bun.lock bunfig.toml ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy source code
COPY . .

# Build the application
RUN bun run build

# Production stage
FROM node:20-alpine

# Install curl for health checks
RUN apk add --no-packages curl

# Copy built assets from builder stage
COPY --from=builder /app/.output /app/.output

WORKDIR /app

EXPOSE 3000

ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=3000

CMD ["node", ".output/server/index.mjs"]