from xmlrpc.client import boolean
from pymongo import MongoClient
from pymongo.errors import CollectionInvalid
from collections import OrderedDict

def userInformation():
    db=MongoClient('mongodb://127.0.0.1:27017/')['myFirstDatabase']

    user_schema={
    'fullName':{
        'type':'string',
        "minlength":1,
        "required":True
    },
    'emailAddress':{
        'type':'string',
        "minlength":1,
        "required":True
    },
    'phoneNumber':{
        'type':'int',
        "minlength":1,
        "required":True
    },
    'password':{
        'type':'string',
        "minlength":1,
        "required":True
    },
    'private':{
        'type':boolean,
        'minlength':1,
        'required':True
    }
    }
    collection='UserInformation'
    validator={"$jsonSchema":{"bsonType":'object','properties':{}}}

    required=[]

    for key in user_schema:
        field=user_schema[key]
        properties={'bsonType':field['type']}
        minimum=field.get('minlength')
        if type(minimum)==int:
            properties['miiumum']=minimum
        if field.get('required') is True:required.append(key)
        validator['$jsonSchema']['properties'][key]=properties
    if len(required)>0:
        validator['$jsonSchema']['required']=required
        query=[('collMod',collection),('validator',validator)]
    try:
        print(db.database_names)
        db.create_collection(collection)
    except CollectionInvalid:
        pass
    command_result=db.command(OrderedDict(query))
