FROM node:20-bullseye-slim as base
RUN apt-get update && apt-get install -y nginx
RUN rm -rf /etc/nginx/sites-enabled/default
COPY ./docker/nocobase/nocobase.conf /etc/nginx/sites-enabled/nocobase.conf

FROM node:20-bullseye as build-template-app
ARG NPM_REGISTRY=https://registry.npmjs.org/

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app
RUN cd /app && npx --registry $NPM_REGISTRY create-tachybase-app@0.21.16  my-nocobase-app -a -e APP_ENV=production
RUN pnpm config set registry $NPM_REGISTRY
RUN --mount=type=cache,id=pnpm,target=/pnpm/store cd /app/my-nocobase-app && pnpm install --production

WORKDIR /app/my-nocobase-app

RUN cd /app \
  && rm -rf my-nocobase-app/packages/app/client/src/.umi \
  && rm -rf nocobase.tar.gz \
  && tar -zcf ./nocobase.tar.gz -C /app/my-nocobase-app .

FROM base AS build-app
COPY --from=build-template-app /app/nocobase.tar.gz /app/nocobase.tar.gz

WORKDIR /app/nocobase

RUN mkdir -p /app/nocobase/storage/uploads/ && echo "$COMMIT_HASH" >> /app/nocobase/storage/uploads/COMMIT_HASH

COPY ./docker/nocobase/docker-entrypoint.sh /app/

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
RUN pnpm config set registry $NPM_REGISTRY

CMD ["/app/docker-entrypoint.sh"]
