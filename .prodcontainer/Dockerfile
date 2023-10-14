FROM node:18-bullseye

WORKDIR /workspace

COPY . /workspace

RUN npm install \
  && npm run build \
  && npx rimraf \
    foundations \
    app \
    pages \
    features \
    types \
    nexpress \
    nextron \
    scripts \
    .babelrc \
    .eslint* \
    .git* \
    tsconfig* \
    .devcontainer \
    node_modules \
  && npm install --production

CMD [ "npx", "next", "start" ]
