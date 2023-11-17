FROM node:20 AS builder

# move files to docker builder
RUN mkdir /lutergs-frontend-pwa
COPY . /lutergs-frontend-pwa

# build docker image
WORKDIR /lutergs-frontend-pwa
RUN npm install && \
    export NODE_ENV=production \
    npm run build

FROM node:20

WORKDIR /
COPY --from=builder /lutergs-frontend-pwa/package.json package.json
COPY --from=builder /lutergs-frontend-pwa/package-lock.json package-lock.json
COPY --from=builder /lutergs-frontend-pwa/build build

RUN npm ci --omit dev
ENTRYPOINT ["node", "build"]

