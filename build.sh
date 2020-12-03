#!/bin/bash

REPO=ursa

build() {
  DATE=`date +%Y%m%d`
  echo "Building $1"
  IMAGE=`echo $1 | awk -F/ '{print $1}'`
  VERSION=`echo $1 | awk -F/ '{print $2}'`
  IMAGE_PATH=`echo $1 | sed -e 's/\/Dockerfile//g'`
  docker build -t $REPO/$IMAGE-$VERSION:latest $IMAGE_PATH
  docker push $REPO/$IMAGE-$VERSION:latest
  docker tag $REPO/$IMAGE-$VERSION:latest $REPO/$IMAGE-$VERSION:$DATE
  docker push $REPO/$IMAGE-$VERSION:$DATE
  echo "Build and push of $1 completed."
}

# Operating Systems first
for OS in centos debian redhat ubuntu ; do
  echo "Starting $OS..."
  for IMAGE in `find $OS -name Dockerfile` ; do
    build $IMAGE
  done
  echo "$OS completed."
done

for SOFT in odoo ; do
  echo "Starting $SOFT..."
  for IMAGE in `find $SOFT -name Dockerfile` ; do
    build $IMAGE
  done
  echo "$SOFT completed."
done

exit 0
