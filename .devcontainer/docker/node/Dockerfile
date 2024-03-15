FROM node:20-bullseye

WORKDIR /workspace

RUN apt-get update -y \
  && apt-get upgrade -y \
  && apt-get install -y --no-install-recommends \
    sudo \
  && apt-get -y clean \
  && rm -rf /var/lib/apt/lists/* \
  && echo 'node:node' | chpasswd \
  && gpasswd -a node sudo

USER node
