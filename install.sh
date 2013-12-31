#!/bin/bash

WEBROOT=/Library/WebServer/Documents

INSTALL_NAME=roost-label-install
WEB_NAME=roost-label

hg archive -I site $WEBROOT/$INSTALL_NAME
ln -s $WEBROOT/$INSTALL_NAME/site $WEBROOT/$WEB_NAME
