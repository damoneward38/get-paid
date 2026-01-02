#!/bin/bash
set -e

echo "Building Gifted Eternity..."

# Install dependencies
pnpm install

# Build frontend
cd client
pnpm build
cd ..

# Build backend
pnpm build:server

echo "Build complete!"
