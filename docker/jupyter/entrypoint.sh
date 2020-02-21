#!/usr/bin/env bash

echo "START JUPYTER"

#--debug --allow-root
jupyter notebook  --no-browser --ip=* --port 8888 --NotebookApp.token=my_very_secret_token --NotebookApp.allow_origin=*