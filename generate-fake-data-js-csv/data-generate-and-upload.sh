#!/bin/bash

set -e

node generate-data.js
node generate-follows.js
node generate-feeds.js
