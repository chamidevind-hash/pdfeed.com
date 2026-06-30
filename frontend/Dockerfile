# syntax=docker/dockerfile:1.7

FROM node:22-bookworm-slim AS dependencies
WORKDIR /app
COPY package.json package-lock.json ./
COPY frontend/package.json frontend/package.json
COPY backend/package.json backend/package.json
RUN npm ci

FROM node:22-bookworm-slim AS builder
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
ARG NEXT_PUBLIC_SITE_URL=https://pdfeed.com
ENV NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL}
COPY --from=dependencies /app/node_modules ./node_modules
COPY package.json package-lock.json ./
COPY frontend ./frontend
COPY backend/package.json backend/package.json
RUN npm run build --workspace frontend

FROM node:22-bookworm-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN groupadd --system --gid 1001 nextjs \
  && useradd --system --uid 1001 --gid nextjs nextjs

COPY --from=builder --chown=nextjs:nextjs /app/frontend/.next/standalone ./
COPY --from=builder --chown=nextjs:nextjs /app/frontend/.next/static ./frontend/.next/static
COPY --from=builder --chown=nextjs:nextjs /app/frontend/public ./frontend/public

USER nextjs
EXPOSE 3000
CMD ["node", "frontend/server.js"]
