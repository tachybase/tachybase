#!/bin/sh
set -e

# cp dist files
cp -r /app/packages/core/app/dist/client/* /app/public/

# handle sentry
original_file="/app/packages/core/app/dist/client/index.html"
sentry_part="index.sentry.html"
output_file="/app/public/index.html"

# The implementation depends on index.html.
# If you modify index.html, please pay attention to whether this logic is affected.
{
    if [[ -f "$sentry_part" ]]; then
      sentry_script=$(<"$sentry_part")
      cat "$original_file" | sed "/<link rel=\"stylesheet\" href=\"\/global.css\">/a $sentry_script"
    else
      cat "$original_file"
    fi
} > "$output_file"

pnpm tachybase upgrade -S
pnpm start --quickstart
