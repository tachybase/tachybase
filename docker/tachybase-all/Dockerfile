FROM node:20-bullseye-slim AS base

ARG NPM_REGISTRY=https://registry.npmjs.org
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV COREPACK_NPM_REGISTRY=$NPM_REGISTRY
RUN corepack enable

COPY . /app
WORKDIR /app

RUN pnpm install --shamefully-hoist
RUN pnpm build:p

RUN pnpm config set registry $NPM_REGISTRY

CMD ["pnpm", "start", "--quickstart"]
