# Wall App

This app runs a website where users can register, login, and make a post on a newsfeed, similar to Facebook and Twitter.
They can also read other user's posts, whether they're logged in or out.

## Project setup
### Windows
```
python -m venv ./env/py
./env/run/py
pip install -r ./config/requirements.pip
npm install
npm run build
```
### Mac/Linux
```
python -m venv ./env/py
source ./env/py/scripts/activate
pip install -r ./config/requirements.pip
npm install
npm run build
```
### Running the project
### Windows
```
# First, activate the virual environment
./env/run/py
python manage.py runserver --settings=settings.dev
# Open a new console
npm run serve
```
### Mac/Linux
```
# First, activate the virual environment
source ./env/py/scripts/activate
cd site
python manage.py runserver --settings=settings.dev
# Open a new console
npm run serve
```
### Run unit tests
```
npm run test:unit
```
