#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SIGNING_KEY_FILE="$SCRIPT_DIR/supabase/signing_key.json"

# Generate signing key 
echo "Generating ES256 signing key..."
supabase gen signing-key --algorithm ES256 --append
echo "Signing key generated at: $SIGNING_KEY_FILE"

# Start Supabase
echo "Starting Supabase..."
cd "$SCRIPT_DIR"
supabase start
