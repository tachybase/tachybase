FROM git.daoyoucloud.com/tachybase/base:latest AS base

ARG NPM_REGISTRY=https://registry.npmjs.org
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

# make cache
COPY . /app
WORKDIR /app
RUN npm config set registry $NPM_REGISTRY
RUN npm i -g pnpm@9.7.0
RUN pnpm config set registry $NPM_REGISTRY
RUN pnpm install --shamefully-hoist
RUN pnpm build:p

COPY ./docker/tachybase/docker-entrypoint.sh /app/
CMD ["/app/docker-entrypoint.sh"]
