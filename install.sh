#!/bin/bash

WEBROOT=/var/www/html/roost/old

INSTALL_NAME=roost-label-install
WEB_NAME=roost-label

git archive label site | tar -x -C $WEBROOT/$INSTALL_NAME
rm $WEBROOT/$WEB_NAME
ln -s $WEBROOT/$INSTALL_NAME/site $WEBROOT/$WEB_NAME
