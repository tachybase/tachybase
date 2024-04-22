FROM node:20 as base

ARG NPM_REGISTRY=https://registry.npmjs.org/
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
RUN pnpm config set registry $NPM_REGISTRY

RUN apt-get update && apt-get install -y nginx
RUN rm -rf /etc/nginx/sites-enabled/default
COPY . /app
COPY ./docker/tachybase/tachybase.conf /etc/nginx/sites-enabled/tachybase.conf
COPY ./docker/tachybase/docker-entrypoint.sh /app/
RUN --mount=type=cache,id=pnpm,target=/pnpm/store cd /app && pnpm install --production
WORKDIR /app
CMD ["/app/docker-entrypoint.sh"]
