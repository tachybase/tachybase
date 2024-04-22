FROM node:20 as base

ARG NPM_REGISTRY=https://registry.npmjs.org/
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

COPY . /app
WORKDIR /app
RUN corepack enable
RUN pnpm config set registry $NPM_REGISTRY
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install

CMD ["pnpm", "start", "--quickstart"]
