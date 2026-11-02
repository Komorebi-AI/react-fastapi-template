# syntax=docker/dockerfile:1

# ---------- Build stage ----------
# Pin the same Node major as .nvmrc. For fully reproducible builds, pin the
# exact version + digest instead (e.g. node:24.7.0-alpine@sha256:...).
FROM node:24-alpine AS build

WORKDIR /app

# Install dependencies in their own layer so they are only re-installed when
# the manifests change, not on every source edit. The npm cache is kept in a
# BuildKit cache mount so repeated builds don't re-download packages.
COPY package.json package-lock.json .npmrc ./
RUN --mount=type=cache,target=/root/.npm npm ci

COPY . .

# Vite env vars are baked into the bundle at build time. Leave empty to use
# the default `/api` (routed by the runtime nginx below or your own proxy):
#   docker build --build-arg VITE_API_URL=https://api.example.com .
ARG VITE_API_URL=
ENV VITE_API_URL=$VITE_API_URL

# Public path the app is served from. Leave empty for the domain root:
#   docker build --build-arg VITE_BASE_PATH=/myapp/ .
ARG VITE_BASE_PATH=
ENV VITE_BASE_PATH=$VITE_BASE_PATH

RUN npm run build

# ---------- Runtime stage ----------
# Unprivileged nginx: runs as a non-root user and listens on 8080.
# Node is not needed at runtime — the app is static files.
FROM nginxinc/nginx-unprivileged:1.29-alpine AS runtime

COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s \
  CMD wget -qO /dev/null http://127.0.0.1:8080/ || exit 1
