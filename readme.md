# Wall App

This app runs a website where users can register, login, and make a post on a newsfeed, similar to Facebook and Twitter.
They can also read other user's posts, whether they're logged in or out.

## Project setup
### Requirements
- Python 3.6+
- NPM

### Windows
Set up Python env
```
python3.6 -m venv ./env/py
./env/run/py
```
Install dependencies
```
pip install -r ../config/requirements.pip
```
Setup database (run these in the site folder)
```
python3.6 manage.py migrate
python3.6 populate.py
```
Install dependencies (run in the root folder)
```
npm install
```
Build bundle
```
npm run build
```
### Mac/Linux
Set up Python env
```
python3.6 -m venv ./env/py
source ./env/py/bin/activate
```
Install dependencies
```
pip install -r ./config/requirements.pip
```
Setup database (run these in the site folder)
```
python3.6 manage.py migrate
python3.6 populate.py
```
Install dependencies (run in the root folder)
```
npm install
```
Build bundle
```
npm run build
```
## Running the project
### Windows
First, activate the virtual environment
```
./env/run/py
```
Run Django dev server from site folder
```
python manage.py runserver
```
Run Vue dev server from root folder
```
npm run serve
```
### Mac/Linux
First, activate the virtual environment
```
source ./env/py/bin/activate
```
Run Django dev server from site folder
```
python manage.py runserver
```
Run Vue dev server from root folder
```
npm run serve
```
## Unit tests
Run from site folder
```
python3.6 manage.py test
```
Run from root folder
```
npm run test:unit
```