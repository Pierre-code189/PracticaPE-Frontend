# Sirve el build de React como SPA estática.
# Uso: docker build -f deploy/frontend.Dockerfile -t practicape-frontend .
FROM node:22-alpine AS build

WORKDIR /build
COPY frontend-react/package.json frontend-react/package-lock.json ./frontend-react/
RUN cd frontend-react && npm ci --no-audit --no-fund
COPY frontend-react/ ./frontend-react/
RUN cd frontend-react && npm run build

FROM nginx:1.27-alpine

COPY deploy/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /build/frontend-react/dist /usr/share/nginx/html

EXPOSE 80
HEALTHCHECK --interval=30s --timeout=5s \
  CMD wget -qO- http://127.0.0.1/ >/dev/null 2>&1 || exit 1

CMD ["nginx", "-g", "daemon off;"]
