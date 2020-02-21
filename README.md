# MLJAR Studio

MLJAR Studio is an Interactive Computing Platform for Humans. 


<p align="center">
<img src="https://raw.githubusercontent.com/mljar/mljar-studio/master/misc/studio.png" width="100%" />
</p>


## Run in docker-compose

You need docker-compose installed. To run MLJAR Studio run following command:

```
sudo docker-compose up --build
```

The Studio is available in the browser at address `0.0.0.0:8000`. To stop the service use `Ctrl+C`.

## Run locally

1. Run client code:

```
# in the client directory
npm install
npm start
```

2. Run server code:

Set up your environment:

```
# in the backend directory
virtualenv venv --python=python3.7
source venv/bin/activate
pip install -r requirements.txt
```

Then start the server:

```
# in the backend/server directory
./manage.py migrate
./manage.py runserver 8003
```

3. Run Jupyter Notebook.

Install dependencies:
```
# in any directory
virtualenv venv --python=python3.7
source venv/bin/activate
pip install jupyter pandas numpy plotly

# make sandbox dir to store projects data
mkdir -p sandbox
```

Run notebook:

```
jupyter notebook  --no-browser --ip=* --port 8888 --NotebookApp.token=my_very_secret_token --NotebookApp.allow_origin=*
```

4. Open MLJAR Studio in the browser:

```
http://localhost:3000/
```