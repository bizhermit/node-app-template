FROM node:18-bullseye

ARG HOST=0.0.0.0
ARG PORT=3000
ENV HOST ${HOST}
ENV PORT ${PORT}

WORKDIR /workspace

COPY . /workspace

RUN npm install \
  npm run clean \
  npm run build

EXPOSE ${PORT}

USER node

CMD [ "npx", "next", "start" ]