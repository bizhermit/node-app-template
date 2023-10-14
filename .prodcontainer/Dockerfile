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
    *.d.ts \
    nexpress \
    scripts \
    .babelrc \
    .eslint* \
    .git* \
    tsconfig* \
    .devcontainer \
    node_modules \
  && npm install --production

CMD [ "npx", "next", "start" ]