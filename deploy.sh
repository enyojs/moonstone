#!/bin/bash

SOURCE=$(cd `dirname $0`; pwd)

# target location
TARGET=$1

if [ x$TARGET = x ]; then

cat <<EOF
Must supply target folder parameter, e.g.:

  deploy.bat ../deploy/lib/moonraker
EOF
else
	mkdir -p $TARGET/images/
	cp -r $SOURCE/images/*.* $TARGET/images/
	mkdir -p $TARGET/fonts/	
	cp -r $SOURCE/fonts/* $TARGET/fonts/	
fi
