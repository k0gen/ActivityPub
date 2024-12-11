#!/usr/bin/env bash

docker build -t generate-fake-data-js-csv .

docker run --rm --tty --name generate-fake-data-js-csv \
    -v $(pwd)/data:/app/data \
    -v $HOME/.config/gcloud:/root/.config/gcloud \
    generate-fake-data-js-csv $@
