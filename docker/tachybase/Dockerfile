FROM git.daoyoucloud.com/tachybase/node:20.18.0 AS base

ARG NPM_REGISTRY=https://registry.npmjs.org
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

COPY . /app
WORKDIR /app

RUN pnpm config set registry $NPM_REGISTRY
RUN pnpm install --shamefully-hoist
RUN pnpm build:p

COPY ./docker/tachybase/docker-entrypoint.sh /app/
CMD ["/app/docker-entrypoint.sh"]
