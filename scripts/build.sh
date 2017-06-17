#! /usr/bin/env bash

# Root directory
ROOT="$( cd "$( dirname "${BASH_SOURCE[0]}" )"/.. && pwd )"

# Add node_modules/.bin to path
PATH=$PATH:$ROOT/node_modules/.bin

# Clean dist
echo "Cleaning dist"
rm -rf $ROOT/dist
mkdir $ROOT/dist

# Development build to publish
echo "Building nighthawk.js"
browserify -s Nighthawk $ROOT/index.js -o $ROOT/dist/nighthawk.js

# Minified build to publish
echo "Building nighthawk.min.js"
browserify -s Nighthawk -u qs -t [envify --NODE_ENV="production"] -g uglifyify $ROOT/index.js | uglifyjs --compress --mangle > $ROOT/dist/nighthawk.min.js

# Slim dev build for disc size analysis
echo "Building nighthawk-slim.min.js"
browserify --full-paths -u process -u buffer -u url -u util -u qs -t [envify --NODE_ENV="production"] -g uglifyify $ROOT/index.js | uglifyjs --compress --mangle > $ROOT/dist/nighthawk-slim.min.js
