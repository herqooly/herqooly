# MLJAR Studio Backend

## Setup the connection to Jupyter Notebook

In config file `~/.jupyter/jupyter_notebook_config.json` set token value

```
{
  "NotebookApp": {
    "token": "my_very_secret_token",
    "allow_orgin": "*",
    "nbserver_extensions": {
      "jupyter_server_proxy": true
    }
  }
}
```

In file `backend/server/server/.env` file set `JUYPTER_TOKEN=my_very_secret_token`.

To run Jupyter Notebook:
```
jupyter notebook --debug --no-browser --ip 127.0.0.1 --port 8888 
```

Make sure that `sandbox` directory is created in notebook dir.

## Run server tests

```
 ./manage.py test apps
```