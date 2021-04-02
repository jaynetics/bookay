#!/bin/bash

set -euo pipefail

STUB_DIR=$(dirname "$0")/../node_modules/react

mkdir -p $STUB_DIR
echo '{ "main": "./stub.js" }' > $STUB_DIR/package.json
echo "
// created by ${0}
// for compatibility with react-scripts 4.x

module.exports = { version: '17.0.0' }
" > $STUB_DIR/stub.js
