#!/bin/sh

set -e

yarn build
yarn lint
yarn type
yarn test --coverage
