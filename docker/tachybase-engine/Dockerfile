FROM tachybase/tachybase-node-pg:0.0.2 AS base

ARG NPM_REGISTRY=https://registry.npmjs.org
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV COREPACK_NPM_REGISTRY=$NPM_REGISTRY
RUN npm install -g corepack@latest
RUN corepack enable

COPY . /app
WORKDIR /app


ENV NODE_MODULES_PATH=/app/plugins/node_modules
RUN npm i -g @tachybase/cli && npm i -g @tachybase/engine
RUN tachybase init

COPY ./docker/tachybase-engine/docker-entrypoint.sh /app/
CMD ["/app/docker-entrypoint.sh"]
