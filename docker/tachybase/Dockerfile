FROM tachybase/tachybase-node-pg:0.0.2 AS base

ARG NPM_REGISTRY=https://registry.npmjs.org
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV COREPACK_NPM_REGISTRY=$NPM_REGISTRY
RUN corepack enable

COPY . /app
WORKDIR /app

RUN pnpm config set registry $NPM_REGISTRY
RUN pnpm install --shamefully-hoist
RUN pnpm build:p

COPY ./docker/tachybase/docker-entrypoint.sh /app/
CMD ["/app/docker-entrypoint.sh"]
