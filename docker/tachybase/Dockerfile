FROM docker.1tops.org/node:20.18.0 AS base

ARG NPM_REGISTRY=https://registry.npmjs.org
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

COPY . /app
WORKDIR /app

COPY ./docker/tachybase/docker-entrypoint.sh /app/
CMD ["/app/docker-entrypoint.sh"]
