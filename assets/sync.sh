#!/bin/bash

set -euo pipefail

DIR=$(dirname "$0")

convert $DIR/icon_large.png -filter Lagrange -resize 16x16   $DIR/../plugin/assets/icon-16.png
convert $DIR/icon_large.png -filter Lagrange -resize 19x19   $DIR/../plugin/assets/icon-19.png
convert $DIR/icon_large.png -filter Lagrange -resize 32x32   $DIR/../plugin/assets/icon-32.png
convert $DIR/icon_large.png -filter Lagrange -resize 38x38   $DIR/../plugin/assets/icon-38.png
convert $DIR/icon_large.png -filter Lagrange -resize 48x48   $DIR/../plugin/assets/icon-48.png
convert $DIR/icon_large.png -filter Lagrange -resize 64x64   $DIR/../plugin/assets/icon-64.png
convert $DIR/icon_large.png -filter Lagrange -resize 96x96   $DIR/../plugin/assets/icon-96.png
convert $DIR/icon_large.png -filter Lagrange -resize 128x128 $DIR/../plugin/assets/icon-128.png

convert $DIR/icon_large.png -filter Lagrange -resize 16x16   $DIR/../webapp/public/favicon/favicon.ico
convert $DIR/icon_large.png -filter Lagrange -resize 16x16   $DIR/../webapp/public/favicon/icon-16.png
convert $DIR/icon_large.png -filter Lagrange -resize 32x32   $DIR/../webapp/public/favicon/icon-32.png
convert $DIR/icon_large.png -filter Lagrange -resize 96x96   $DIR/../webapp/public/favicon/icon-96.png
