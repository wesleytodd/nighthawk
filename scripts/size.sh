#! /usr/bin/env bash

# Root directory
ROOT="$( cd "$( dirname "${BASH_SOURCE[0]}" )"/.. && pwd )"

# Add node_modules/.bin to path
PATH=$PATH:$ROOT/node_modules/.bin

# Run build
$ROOT/scripts/build.sh

# Run gzips
echo "Gzipping bundles"
gzip -c $ROOT/dist/nighthawk.min.js > $ROOT/dist/nighthawk.min.js.gz
gzip -c $ROOT/dist/nighthawk-slim.min.js > $ROOT/dist/nighthawk-slim.min.js.gz

# Print size
echo "=========================="
echo "File size: "$(($(stat -f "%z" $ROOT/dist/nighthawk.js) / 1024))"kb"
echo "Minified file size: "$(($(stat -f "%z" $ROOT/dist/nighthawk.min.js) / 1024))"kb"
echo "Gzipped file size: "$(($(stat -f "%z" $ROOT/dist/nighthawk.min.js.gz) / 1024))"kb"

echo "Slim file size: "$(($(stat -f "%z" $ROOT/dist/nighthawk-slim.min.js) / 1024))"kb"
echo "Slim gzipped file size: "$(($(stat -f "%z" $ROOT/dist/nighthawk-slim.min.js.gz) / 1024))"kb"

# Disc analysis
discify $ROOT/dist/nighthawk-slim.min.js -O 
