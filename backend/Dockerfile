# syntax=docker/dockerfile:1.7

FROM node:22-bookworm-slim AS dependencies
WORKDIR /app
COPY package.json package-lock.json ./
COPY frontend/package.json frontend/package.json
COPY backend/package.json backend/package.json
RUN npm ci --omit=dev --workspace backend --include-workspace-root=false

FROM node:22-bookworm-slim AS runner
ENV NODE_ENV=production
ENV PORT=4000
ENV HOME=/tmp/file-convert-home
ENV PYTHON_PATH=python3
ENV LIBREOFFICE_PATH=libreoffice
ENV PDFTOPPM_PATH=pdftoppm
ENV GHOSTSCRIPT_PATH=gs

RUN apt-get update \
  && apt-get install -y --no-install-recommends \
    ghostscript \
    libreoffice-calc \
    libreoffice-writer \
    poppler-utils \
    python3 \
    python3-pip \
    python3-venv \
    fonts-dejavu-core \
    fonts-liberation \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app/backend
COPY backend/python/requirements.txt ./python/requirements.txt
RUN python3 -m venv /opt/pdf-tools \
  && /opt/pdf-tools/bin/pip install --no-cache-dir -r python/requirements.txt

ENV PATH="/opt/pdf-tools/bin:${PATH}"

COPY --from=dependencies /app/node_modules /app/node_modules
COPY --chown=node:node backend/src ./src
COPY --chown=node:node backend/python ./python
COPY --chown=node:node backend/package.json ./package.json

RUN mkdir -p uploads converted "${HOME}" \
  && chown -R node:node uploads converted "${HOME}"

USER node
EXPOSE 4000
CMD ["node", "src/server.js"]
