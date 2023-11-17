FROM node:20 AS builder

ARG BACKEND_SERVER
ARG PUSH_KEY
#ENV NODE_ENV=production

# move files to docker builder
RUN mkdir /lutergs-frontend-pwa
COPY . /lutergs-frontend-pwa

# build docker image
WORKDIR /lutergs-frontend-pwa
RUN echo "PUBLIC_BACKEND_SERVER=$BACKEND_SERVER" > /lutergs-frontend-pwa/.env
RUN echo "PUBLIC_PUSH_KEY=$PUSH_KEY" >> /lutergs-frontend-pwa/.env
RUN echo "PUBLIC_ENV=dev" >> /lutergs-frontend-pwa/.env
RUN npm install
RUN npm run build

FROM node:20

WORKDIR /
COPY --from=builder /lutergs-frontend-pwa/package.json package.json
COPY --from=builder /lutergs-frontend-pwa/package-lock.json package-lock.json
COPY --from=builder /lutergs-frontend-pwa/build build

RUN npm ci --omit dev
ENTRYPOINT ["node", "build"]

