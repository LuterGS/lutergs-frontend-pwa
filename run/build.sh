#!/bin/sh

echo "PUBLIC_BACKEND_SERVER=$PUBLIC_BACKEND_SERVER" > /lutergs-frontend-pwa/.env
echo "PUBLIC_PUSH_KEY=$PUBLIC_PUSH_KEY" >> /lutergs-frontend-pwa/.env
echo "PUBLIC_ENV=dev" >> /lutergs-frontend-pwa/.env

npm install

PUBLIC_BACKEND_SERVER="$PUBLIC_BACKEND_SERVER" \
PUBLIC_PUSH_KEY="$PUBLIC_PUSH_KEY" \
PUBLIC_ENV=dev \
npm run build