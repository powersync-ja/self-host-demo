#!/bin/sh
set -eu

echo "=== Convex Setup ==="

ADMIN_KEY_FILE="/setup/admin_key"
echo "Checking for admin key at ${ADMIN_KEY_FILE}..."

if [ ! -s "$ADMIN_KEY_FILE" ]; then
  echo "ERROR: Admin key file not found or empty"
  exit 1
fi

ADMIN_KEY=$(grep -v '^[[:space:]]*$' "$ADMIN_KEY_FILE" | tail -1 | tr -d '\r\n')

if [ -z "$ADMIN_KEY" ]; then
  echo "ERROR: Could not parse admin key"
  exit 1
fi

echo "Admin key obtained"

echo "Pushing Convex functions..."
export CONVEX_SELF_HOSTED_ADMIN_KEY="$ADMIN_KEY"
npx convex deploy
echo "Functions pushed"

echo "Configuring JWT keys..."
node /convex-backend/scripts/setup-env.mjs

echo "=== Convex Setup Complete ==="
