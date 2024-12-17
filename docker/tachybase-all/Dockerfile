FROM node:20-bullseye as builder

ARG NPM_REGISTRY=https://registry.npmjs.org
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV COREPACK_NPM_REGISTRY=$NPM_REGISTRY

COPY . /app
WORKDIR /app

RUN corepack enable && \
  pnpm config set registry $NPM_REGISTRY && \
  pnpm install --shamefully-hoist && \
  pnpm build:p

CMD ["pnpm", "start", "--quickstart"]
