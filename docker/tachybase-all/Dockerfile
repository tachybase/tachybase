FROM node:20-bookworm AS builder

ARG NPM_REGISTRY=https://registry.npmjs.org

WORKDIR /app

ENV NODE_MODULES_PATH=/app/plugins/node_modules
RUN npm i -g @tachybase/cli && npm i -g @tachybase/engine
RUN tachybase init

CMD ["tachybase-engine", "start", "--quickstart"]
