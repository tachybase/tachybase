#!/bin/sh
set -e

cp -r /app/packages/core/app/dist/client/* /app/public/
pnpm tachybase upgrade -S
pnpm start --quickstart
