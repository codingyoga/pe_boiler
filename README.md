# Creating database changes
python3

from red.master import db, create_app
db.create_all(app=create_app())

### drop all tables and create completly new

from red.master import db, create_app
db.drop_all(app=create_app())
db.create_all(app=create_app())

## Software install

sudo apt-get install -y python3
sudo apt-get install -y python3-pip
sudo apt-get install -y python3-mysqldb
sudo apt-get install libmysqlclient-dev

sudo pip3 install mysqlclient


<!-- sudo apt-get install python3-dev
sudo apt-get install libmysqlclient-dev
sudo apt-get install zlib1g-dev
sudo pip3 install mysqlclient -->

<!-- sudo apt-get install libmysqlclient-dev
sudo -H pip3 install mysqlclient -->

pip3 install -r requirements.txt

## run
python3 myapp.py

## Comments
session.using_bind('slave').query(User).filter_by(id=1).first() 

https://stackoverflow.com/questions/12093956/how-to-separate-master-slave-db-read-writes-in-flask-sqlalchemy

## JSON Schema Creation 
https://www.jsonschema.net/


## Localization of variable (run from src)

Create a POT File

pybabel extract -F ../babel.cfg -o messages.pot .

Cteate PO file from it, Then change the texts

pybabel init -i messages.pot -d translations -l es

Copile the files to generete binary file (mo)

pybabel compile -d translations

