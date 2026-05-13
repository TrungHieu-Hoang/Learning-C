#!/bin/sh
set -e

# Use --no-install to prevent npx from downloading a different Prisma version
npx --no-install prisma db push --schema=prisma/schema.prisma --accept-data-loss --skip-generate 2>&1

node prisma/seed.mjs 2>&1

exec node server.js
