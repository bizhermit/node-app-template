FROM node:18-bullseye

WORKDIR /workspace

COPY . /workspace

RUN apt-get update -y \
  && apt-get upgrade -y \
  # && apt-get install -y --no-install-recommends \
  && apt-get -y clean \
  && rm -rf /var/lib/apt/lists/* \
  && npm install \
  && npm run build \
  && npx rimraf \
    src \
    scripts \
    .eslint* \
    .git* \
    .devcontainer \
    node_modules \
  && npm install --production

CMD [ "npx", "next", "start", "-p", "$NEXT_PORT" ]
