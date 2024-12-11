#!/bin/bash

gcloud storage cp -r data gs://scale-testing-data/data_$(date +%Y-%m-%d_%H-%M-%S)
