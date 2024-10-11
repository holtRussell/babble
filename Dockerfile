FROM cgr.dev/chainguard/node:latest AS build

WORKDIR /app

ENV APP_HOME=/app

COPY --chown=node:node public ${APP_HOME}/public
COPY --chown=node:node src ${APP_HOME}/src
COPY --chown=node:node nginx ${APP_HOME}/nginx
COPY --chown=node:node package.json ${APP_HOME}/package.json
COPY --chown=node:node vite.config.js ${APP_HOME}/vite.config.js
COPY --chown=node:node index.html ${APP_HOME}/index.html
COPY --chown=node:node main.jsx ${APP_HOME}/main.jsx
COPY --chown=node:node index.css ${APP_HOME}/index.css

RUN npm install
RUN npm run build

# Stage 2 - NGINX
FROM cgr.dev/chainguard/nginx:latest

WORKDIR /usr/share/nginx/html

COPY --from=build /app/dist /usr/share/nginx/html
COPY --from=build /app/nginx/default.conf /etc/nginx/conf.d/default.conf