#!/bin/bash

if [[ "$1" == "master" ]]; then 
	echo
	echo Deploying Senti External API $1 ... 
	rsync -r --quiet $2/ deploy@rey.webhouse.net:/srv/nodejs/senti/services/externalAPI/production
	echo
	echo Restarting Senti External API service: $1 ... 
	ssh deploy@rey.webhouse.net 'sudo /srv/nodejs/senti/services/externalAPI/production/scripts/service-restart.sh master'
	echo
	echo Deployment to Senti External API $1 and restart done!
	exit 0
fi 

if [[ "$1" == "dev" ]]; then 
	echo
	echo Deploying Senti External API $1 ... 
	rsync -r --quiet $2/ deploy@rey.webhouse.net:/srv/nodejs/senti/services/externalAPI/development
	echo
	echo Restarting Senti External API service: $1 ... 
	ssh deploy@rey.webhouse.net 'sudo /srv/nodejs/senti/services/externalAPI/development/scripts/service-restart.sh dev'
	echo
	echo Deployment to Senti External API $1 and restart done!
	exit 0
fi