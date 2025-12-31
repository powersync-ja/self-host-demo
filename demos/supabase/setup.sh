#!/bin/bash

# This is a helper script for the demo to create a Supabase signing key. 
# In a production environment, you would use the Supabase CLI to create the signing key and store it securely.

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SIGNING_KEY_FILE="$SCRIPT_DIR/supabase/signing_key.json"

# Generate signing key 
echo "Generating ES256 signing key..."
echo "[]" > $SIGNING_KEY_FILE
supabase gen signing-key --algorithm ES256 --append
echo "Signing key generated at: $SIGNING_KEY_FILE"

# Start Supabase
echo "Starting Supabase..."
cd "$SCRIPT_DIR"
supabase start
