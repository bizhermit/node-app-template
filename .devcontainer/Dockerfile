FROM node:18-bullseye

WORKDIR /workspace

RUN apt-get update -y \
  && apt-get upgrade -y \
  # && apt-get install -y --no-install-recommends \
  && apt-get -y clean \
  && rm -rf /var/lib/apt/lists/*

USER node