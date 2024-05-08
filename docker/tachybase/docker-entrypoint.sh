#!/bin/sh
set -e

cp -r /app/packages/core/app/dist/client/* /app/public/
pnpm start --quickstart
