#!/bin/bash

set -e

BUCKET_NAME=scale-testing-data

mkdir -p data

node generate-data.js
node generate-follows.js
node generate-feeds.js

gcloud storage cp -r data gs://${BUCKET_NAME}/data_$(date +%Y-%m-%d_%H-%M-%S)

