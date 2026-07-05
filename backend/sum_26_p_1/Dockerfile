# Stage 1: Dependencies
FROM node:22.14.0-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Set pnpm global bin
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# Copy package files
COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml* ./

# Install dependencies
RUN pnpm install --no-frozen-lockfile

# Stage 2: Builder
FROM node:22.14.0-alpine AS builder
WORKDIR /app

# Set pnpm global bin
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# Copy dependencies
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build the application
RUN pnpm build

# Stage 3: Runner
FROM node:22.14.0-alpine AS runner
WORKDIR /app

# Set to production environment
ENV NODE_ENV=production

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs
USER nestjs

# Copy build output and necessary files
COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nestjs:nodejs /app/package.json ./package.json

# Expose the application port
EXPOSE 3000

# Start the application
CMD ["node", "dist/main.js"] 
