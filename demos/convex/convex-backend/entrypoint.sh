#!/bin/sh
set -e

echo "=== Convex Setup ==="

# Read admin key from shared volume (written by convex-keygen service)
ADMIN_KEY_FILE="/setup/admin_key"
echo "Waiting for admin key at ${ADMIN_KEY_FILE}..."

RETRIES=0
while [ ! -s "$ADMIN_KEY_FILE" ] && [ "$RETRIES" -lt 30 ]; do
  sleep 1
  RETRIES=$((RETRIES + 1))
done

if [ ! -s "$ADMIN_KEY_FILE" ]; then
  echo "ERROR: Admin key file not found or empty after 30s"
  exit 1
fi

# The generate_admin_key.sh output may contain extra text; extract only the key line
# The admin key is typically the last non-empty line of output
ADMIN_KEY=$(grep -v '^\s*$' "$ADMIN_KEY_FILE" | tail -1 | tr -d '\r\n')

if [ -z "$ADMIN_KEY" ]; then
  echo "ERROR: Could not parse admin key"
  exit 1
fi

echo "✔ Admin key obtained"

# Create .env.local for the Convex CLI
cat > /app/.env.local << EOF
CONVEX_SELF_HOSTED_URL=${CONVEX_SELF_HOSTED_URL}
CONVEX_SELF_HOSTED_ADMIN_KEY=${ADMIN_KEY}
EOF

echo "✔ .env.local created"

# Push Convex functions to the backend
echo "Pushing Convex functions..."
npx convex dev --once

echo "✔ Functions pushed"

# Generate JWT keys and set Convex environment variables
echo "Configuring JWT keys..."
node scripts/setup-env.mjs

echo "=== Convex Setup Complete ==="
