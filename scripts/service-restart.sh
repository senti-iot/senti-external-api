#!/bin/bash
# chmod 700 api-restart.sh

if [[ "$1" == "master" ]]; then 
	npm install --prefix /srv/nodejs/senti/services/externalAPI/production
	systemctl restart senti-externalAPI.service
	# Senti Slack Workspace
	curl -X POST -H 'Content-type: application/json' --data '{"text":"Senti External API MASTER updated and restarted!"}' https://hooks.slack.com/services/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
	echo
	exit 0
fi

if [[ "$1" == "dev" ]]; then 
	npm install --prefix /srv/nodejs/senti/services/externalAPI/development
	systemctl restart senti-externalAPI-dev.service
	# Senti Slack Workspace
	curl -X POST -H 'Content-type: application/json' --data '{"text":"Senti External API DEV updated and restarted!"}' https://hooks.slack.com/services/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
	echo
	exit 0
fi

exit 0


