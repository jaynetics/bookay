#!/bin/bash

set -euo pipefail

DIR=$(dirname "$0")

SRC=$DIR/../build
DST=$DIR/../../server/webapp/build

touch $DST && rm -rf $DST && cp -rv $SRC $DST
