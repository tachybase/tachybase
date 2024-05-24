FROM node:20-bullseye-slim as base
RUN apt-get update && apt-get install -y nginx
RUN rm -rf /etc/nginx/sites-enabled/default
COPY ./docker/tachybase/tachybase.conf /etc/nginx/sites-enabled/tachybase.conf

FROM node:20-bullseye as build-template-app
ARG NPM_REGISTRY=https://registry.npmjs.org/
ARG TACHYBASE_VERSION=0.21.16

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app
RUN cd /app && npx --registry $NPM_REGISTRY create-tachybase-app@$TACHYBASE_VERSION my-tachybase-app -a -e APP_ENV=production
RUN pnpm config set registry $NPM_REGISTRY
RUN --mount=type=cache,id=pnpm,target=/pnpm/store cd /app/my-tachybase-app && pnpm install --production

WORKDIR /app/my-tachybase-app

RUN cd /app \
  && rm -rf my-tachybase-app/packages/app/client/src/.umi \
  && rm -rf tachybase.tar.gz \
  && tar -zcf ./tachybase.tar.gz -C /app/my-tachybase-app .

FROM base AS build-app
COPY --from=build-template-app /app/tachybase.tar.gz /app/tachybase.tar.gz

WORKDIR /app/tachybase

RUN mkdir -p /app/tachybase/storage/uploads/ && echo "$COMMIT_HASH" >> /app/tachybase/storage/uploads/COMMIT_HASH

COPY ./docker/tachybase/docker-entrypoint.sh /app/

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
RUN pnpm config set registry $NPM_REGISTRY

CMD ["/app/docker-entrypoint.sh"]
