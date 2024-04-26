from flask import Flask
from flask_pymongo import PyMongo
import gridfs

from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate
from flask_socketio import SocketIO, send, emit

app = Flask(__name__)
import config



bcrypt = Bcrypt(app)
jwt = JWTManager(app)
mongodb_client = PyMongo(app)
db=mongodb_client.db
fs=gridfs.GridFS(db)
    
CORS(app)
socketio = SocketIO(app)


socketio =  SocketIO(app,cors_allowed_origins='*')


#model

# @socketio.on('connect_test')
# def connect():
#     print('connect')

#views

import webapp.views.user
import webapp.views.social
import webapp.views.content

#forms
