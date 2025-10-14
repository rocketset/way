# ---- build (Vite) ----
FROM node:20-alpine AS build
WORKDIR /app

# Toolchain para módulos nativos (bcrypt, sharp, canvas etc.)
RUN apk add --no-cache python3 make g++ libc6-compat

COPY package*.json ./
# Evita auditoria, acelera e contorna peer deps rígidos do npm 10
RUN npm config set fund false && npm config set audit false \
 && npm ci --legacy-peer-deps

COPY . .
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

# ---- runtime (Nginx) ----
FROM nginx:1.27-alpine
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 4010
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://127.0.0.1:4010/ || exit 1
CMD ["nginx", "-g", "daemon off;"]
