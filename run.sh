#!/bin/sh

echo "PUBLIC_BACKEND_SERVER=$PUBLIC_BACKEND_SERVER" > /app/.env
echo "PUBLIC_PUSH_KEY=$PUBLIC_PUSH_KEY" >> /app/.env

npm ci --omit dev
node -r dotenv/config build