#!/bin/bash

set -euo pipefail

DIR=$(dirname "$0")

cp $DIR/*.js $DIR/../plugin/shared/
cp $DIR/*.js $DIR/../webapp/src/shared/
