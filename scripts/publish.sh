#!/bin/sh

set -e

# Build and check quality
yarn build
yarn lint
yarn type
yarn test --coverage

# Move into newly built package
cd .build

# Finally publish
npm adduser
npm publish --access public
