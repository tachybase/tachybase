FROM node:20-bullseye as builder
ARG VERDACCIO_URL=https://npm.daoyoucloud.com/

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app
RUN cd /app && npx --registry $VERDACCIO_URL create-nocobase-app@0.21.4  my-nocobase-app -a -e APP_ENV=production
RUN pnpm config set registry $VERDACCIO_URL
RUN --mount=type=cache,id=pnpm,target=/pnpm/store cd /app/my-nocobase-app && pnpm install --production

WORKDIR /app/my-nocobase-app

RUN cd /app \
  && rm -rf my-nocobase-app/packages/app/client/src/.umi \
  && rm -rf nocobase.tar.gz \
  && tar -zcf ./nocobase.tar.gz -C /app/my-nocobase-app .


FROM node:20-bullseye-slim
RUN apt-get update && apt-get install -y nginx
RUN rm -rf /etc/nginx/sites-enabled/default
COPY ./docker/nocobase/nocobase.conf /etc/nginx/sites-enabled/nocobase.conf
COPY --from=builder /app/nocobase.tar.gz /app/nocobase.tar.gz

WORKDIR /app/nocobase

RUN mkdir -p /app/nocobase/storage/uploads/ && echo "$COMMIT_HASH" >> /app/nocobase/storage/uploads/COMMIT_HASH

COPY ./docker/nocobase/docker-entrypoint.sh /app/

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
RUN pnpm config set registry $VERDACCIO_URL

CMD ["/app/docker-entrypoint.sh"]
