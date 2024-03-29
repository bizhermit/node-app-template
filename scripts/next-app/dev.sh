#!/bin/bash

ENV_FILE=".env"
ENV_LOCAL_FILE=".env.local"

source "$ENV_FILE"

if [ -f "$ENV_LOCAL_FILE" ]; then
  source "$ENV_LOCAL_FILE"
fi

if [ -z "$NEXT_PORT" ]; then
  export NEXT_PORT=3000
fi

npm run clean
npm run route
npx next dev -p $NEXT_PORT
