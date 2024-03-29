#!/bin/bash

# DEV_CONT_ENV_FILE=".devcontainer/.env"
# if [ -f "$DEV_CONT_ENV_FILE" ]; then
#   source "$DEV_CONT_ENV_FILE"
# fi

# if [ -z "$NEXT_PORT" ]; then
#   export NEXT_PORT=3000
# fi

# if [ -z "$NEXTAUTH_URL" ]; then
#   export NEXTAUTH_URL="http://localhost:$NEXT_PORT"
# fi

# if [ -z "$NEXTAUTH_SECRET" ]; then
#   export NEXTAUTH_SECRET="secret"
# fi

npm run clean
npm run route
npx next dev -p $NEXT_PORT
