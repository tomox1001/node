#!/bin/bash -ex

DIR=$(cd $(dirname $0); pwd)'/data'

for FILE in $(ls $DIR | grep '.json$');
do
	COLLECTION=$(basename $FILE .json)
	mongoimport -d momongoz_test --drop --collection $COLLECTION $DIR/$FILE
done;
