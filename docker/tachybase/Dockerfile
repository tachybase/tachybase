FROM git.daoyoucloud.com/tachybase/base:latest as base

ARG NPM_REGISTRY=https://registry.npmjs.org/
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

# make cache
COPY .pnpm-store /pnpm/store
COPY . /app
WORKDIR /app
RUN corepack enable
RUN pnpm config set registry $NPM_REGISTRY
RUN pnpm install --shamefully-hoist
RUN pnpm build:p

COPY ./docker/tachybase/docker-entrypoint.sh /app/
CMD ["/app/docker-entrypoint.sh"]
