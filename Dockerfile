FROM node:20 AS builder

ARG BACKEND_SERVER
ARG PUSH_KEY

ENV PUBLIC_BACKEND_SERVER=$BACKEND_SERVER
ENV PUBLIC_PUSH_KEY=$PUSH_KEY

# move files to docker builder
RUN mkdir /lutergs-frontend-pwa
COPY . /lutergs-frontend-pwa

# build docker image
WORKDIR /lutergs-frontend-pwa
COPY ./run/build.sh /lutergs-frontend-pwa/build.sh
RUN chmod 755 /lutergs-frontend-pwa/build.sh && \
    /lutergs-frontend-pwa/build.sh

FROM node:20

RUN mkdir -p /app
WORKDIR /app
COPY --from=builder /lutergs-frontend-pwa/package.json /app/package.json
COPY --from=builder /lutergs-frontend-pwa/package-lock.json /app/package-lock.json
COPY --from=builder /lutergs-frontend-pwa/build /app/build
COPY run/run.sh /app/run.sh

ENTRYPOINT ["/bin/sh", "/app/run.sh"]

