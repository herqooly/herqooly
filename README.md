# Herqooly

Convert Python Notebooks into Dashboards


<p align="center" >
<img src="https://raw.githubusercontent.com/mljar/mljar-studio/master/misc/studio.png" width="90%" />
</p>


Herqooly is using:

 - Jupyter Notebook server for computation
 - Django server to store needed information and manage the projects,
 - react and redux in the frontend.


## Main Features

#### Low code

Each cell (when focused) has a toolbar.

<p align="center" >
<img src="https://raw.githubusercontent.com/mljar/mljar-studio/master/misc/low_code_1.png" width="90%" />
</p>

By clicking on toolbar you can select the next step in the notebook. You need to define the step in the modal.

<p align="center" >
<img src="https://raw.githubusercontent.com/mljar/mljar-studio/master/misc/low_code_2.png" width="90%" />
</p>

After filling all inputs you will have code generated. After clicking `Add to script` the code will be added to the notebook and executed. (All needed imports will be inserted to the code.)

<p align="center" >
<img src="https://raw.githubusercontent.com/mljar/mljar-studio/master/misc/low_code_3.png" width="90%" />
</p>

<p align="center" >
<img src="https://raw.githubusercontent.com/mljar/mljar-studio/master/misc/low_code_4.png" width="90%" />
</p>

#### Easy results sharing

You can share notebook results by clicking `Share` button. (Only results will be shared, user will not see the code)
<p align="center" >
<img src="https://raw.githubusercontent.com/mljar/mljar-studio/master/misc/share_1.png" width="90%" />
</p>

Example of shared results. 

<p align="center" >
<img src="https://raw.githubusercontent.com/mljar/mljar-studio/master/misc/share_2.png" width="90%" />
</p>

Results can be embedded in external websites.

#### Custom layout

You can easily customize the layout of results with drag and drop interface.

<p align="center" >
<img src="https://raw.githubusercontent.com/mljar/mljar-studio/master/misc/layout_1.png" width="90%" />
</p>

#### Project based

Each project created in the studio has defined directory structure (similar to https://github.com/drivendata/cookiecutter-data-science)

<p align="center" >
<img src="https://raw.githubusercontent.com/mljar/mljar-studio/master/misc/project_based_1.png" width="90%" />
</p>

You see screenshots from Jupyter interface:

<p align="center" >
<img src="https://raw.githubusercontent.com/mljar/mljar-studio/master/misc/project_based_2.png" width="90%" />
</p>


<p align="center" >
<img src="https://raw.githubusercontent.com/mljar/mljar-studio/master/misc/project_based_3.png" width="90%" />
</p>

Each script created in the MLJAR Studio has corresponding files in:
 
 - Jupyter Notebook format `*.ipnyb` file
 - Python file `*.py` file 

<p align="center" >
<img src="https://raw.githubusercontent.com/mljar/mljar-studio/master/misc/project_based_4.png" width="90%" />
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

#### Warning

This code is intended to run only locally. Please do not deploy to servers because of security issues.
