#!/usr/bin/env bash
set -euo pipefail

APP_DIR="/home/matias/Documentos/blog"
APP_NAME="arevdev"
NVM_DIR="$HOME/.nvm"

echo "=== Deploy: $APP_NAME ==="
date

[ -s "$NVM_DIR/nvm.sh" ] && source "$NVM_DIR/nvm.sh"

cd "$APP_DIR"

echo "[1/5] Pulling latest code..."
git pull origin main

echo "[2/5] Installing production dependencies..."
npm install --production --ignore-scripts 2>/dev/null || npm install --production

echo "[3/5] Generating Prisma client..."
npx prisma generate

echo "[4/5] Building static assets and pages..."
npm run build

echo "[5/5] Restarting application..."
pm2 startOrReload ecosystem.config.js --update-env

echo "=== Deploy complete ==="
