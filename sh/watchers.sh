#!/bin/bash
set -e

bash sh/webpack.sh &

# ESLint the server files:
nodemon --watch server --watch shared --exec "eslint --config server/.eslintrc.server.js server shared" &
  
wait