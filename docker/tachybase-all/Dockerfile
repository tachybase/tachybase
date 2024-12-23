FROM node:20-bookworm as builder

RUN apt-get update \
  && apt-get install -y ninja-build cmake zip \
  && rm -rf /var/lib/apt/lists/*

ENV VCPKG_FORCE_SYSTEM_BINARIES=1

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
