FROM node:18-bullseye

WORKDIR /workspace

COPY . /workspace

RUN npm install \
  && npm run build \
  && npx rimraf \
    src \
    scripts \
    .eslint* \
    .git* \
    .devcontainer \
    node_modules \
  && npm install --production

CMD [ "npx", "next", "start" ]
