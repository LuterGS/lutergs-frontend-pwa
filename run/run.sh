#!/bin/sh

echo "PUBLIC_BACKEND_SERVER=$PUBLIC_BACKEND_SERVER" > /app/.env
echo "PUBLIC_PUSH_KEY=$PUBLIC_PUSH_KEY" >> /app/.env
echo "PUBLIC_ENV=dev" >> /app/.env

npm ci --omit dev

PUBLIC_BACKEND_SERVER=$PUBLIC_BACKEND_SERVER \
PUBLIC_PUSH_KEY=$PUBLIC_PUSH_KEY \
PUBLIC_ENV=dev \
node -r dotenv/config build