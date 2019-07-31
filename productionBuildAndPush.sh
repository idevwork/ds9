#! /usr/bin/env sh

# quasar build

rsync --dry-run -avz --exclude '.sh' ./dist/spa-mat/* root@165.227.219.208:/home/purple/ds9/dist
# rsync -avz --exclude '.sh' ./dist/spa-mat/* root@165.227.219.208:/home/purple/ds9/dist
