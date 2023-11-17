FROM node:20 AS builder

# move files to docker builder
RUN mkdir /lutergs-frontend
COPY . /lutergs-frontend

# build docker image
WORKDIR /lutergs-frontend
RUN npm install
RUN npm run build

FROM node:20

WORKDIR /
COPY --from=builder /lutergs-frontend/package.json package.json
COPY --from=builder /lutergs-frontend/package-lock.json package-lock.json
COPY --from=builder /lutergs-frontend/build build

RUN npm ci --omit dev
ENTRYPOINT ["node", "build"]

