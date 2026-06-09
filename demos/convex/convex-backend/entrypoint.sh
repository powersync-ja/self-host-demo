#!/bin/sh
set -eu

echo "=== Convex Setup ==="

DEPLOY_KEY_FILE="/setup/deploy_key"
echo "Checking for deploy key at ${DEPLOY_KEY_FILE}..."

if [ ! -s "$DEPLOY_KEY_FILE" ]; then
  echo "ERROR: Deploy key file not found or empty"
  exit 1
fi

DEPLOY_KEY=$(tr -d '\r\n' < "$DEPLOY_KEY_FILE")

if [ -z "$DEPLOY_KEY" ]; then
  echo "ERROR: Deploy key is empty"
  exit 1
fi

echo "Deploy key obtained"

echo "Pushing Convex functions..."
export CONVEX_SELF_HOSTED_ADMIN_KEY="$DEPLOY_KEY"
npx convex deploy
echo "Functions pushed"

echo "Configuring JWT keys..."
node /convex-backend/scripts/setup-env.mjs

echo "=== Convex Setup Complete ==="
