#! /usr/bin/env sh

# cd /home/purple/ds9 
quasar build

rsync -avz --exclude '.sh' ./dist/spa-mat/* root@138.197.158.217:/home/purple/ds9/dist
