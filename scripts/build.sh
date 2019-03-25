#!/bin/sh

set -e

# Clean old build
rm -rf .build

# Build code
babel src --out-dir .build/src --extensions ".ts,.tsx" --ignore "**/*.test.ts" --ignore "**/*.test.tsx"
babel index.ts --out-file .build/index.js

# Output type declarations
tsc

# Copy files
cp README.md .build/README.md
cp package.json .build/package.json
