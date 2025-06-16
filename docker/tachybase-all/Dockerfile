FROM node:20-bookworm as builder

ARG NPM_REGISTRY=https://registry.npmjs.org

COPY . /app
WORKDIR /app

ENV NODE_MODULES_PATH=/app/plugins/node_modules
RUN npm i -g @tachybase/cli && npm i -g @tachybase/engine
RUN tachybase init

CMD ["tachybase-engine", "start", "--quickstart"]
