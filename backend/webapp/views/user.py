from datetime import datetime, timedelta
import math
from random import random
import re

from webapp import app, db
from smtp import send_message
from flask import request, jsonify
from webapp.forms.user import EditProfile, UserForm, LoginForm
from flask_jwt_extended import create_access_token, set_access_cookies, jwt_required, unset_jwt_cookies, get_jwt_identity
from bson.objectid import ObjectId

import bcrypt

salt=bcrypt.gensalt()

def hash_value(value):
    print(value,'value')
    return bcrypt.hashpw(bytes(value,'utf-8'),salt)
def check_has_value(value,hash):
    #print(bytes(value,'utf-8'),bytes(hash,'utf-8'),bcrypt.checkpw(bytes(value,'utf-8'),bytes(hash,'utf-8')))
    if bcrypt.checkpw(bytes(value,'utf-8'),hash):
        return True
    else:
        return False

def generateOtp():
    digits = '0123456789'
    OTP = ""
    for i in range(5):
        OTP += digits[math.floor(random()*10)]
    return OTP,'''<h3>Dear user, <br /> Your OTP is <b>'''+OTP+'''</b> </h3><br /><hr> <h3>Regards,<br />Leylines</h3>'''


@app.route('/')
def user_index():
    print('hit')
    return 'Success'


@app.route('/v1/register', methods=['POST'])
def user_register():
    print('in')
    data = request.get_json()
    print(data)
    form = UserForm(data=data, csrf_enabled=False)
    if not form.validate():
        return form.errors, 422
    row = {
        'username':data['username'],

        'email': data['email'], 
        'password': hash_value(data['password']),
        'wallet': False, 
        'address': None,
         "open": data['open'],
        "account_sharing": True,
        'profile_view': {},
         'profile_spy': False, 
        'visible': False, 'account_sharing': True,
         'post_sharing': True,
         'search_visibility':True,
        'profile_id': "",
        "online":datetime.now(),
        'desc':'',
        'verified':False,
        'attempts':0,
        'profile_picture':{}
    }

    if data['address']:
        row['wallet'] = True
        row['address'] = data['address']
    otp,msg=generateOtp()

    row['otp']= hash_value(otp)
    db.users.insert_one(row)
    # data['is_activated']=False
    print(otp)
    send_message( data['email'],'OTP for Leylines',msg)

    return {'status': 'success', }, 200


@app.route('/v1/authenticate')
@jwt_required()
def authenticate():
    user_id=get_jwt_identity()
    db.users.update_one({"_id":ObjectId(user_id)},{"$set":{"online":datetime.now()}})

    return {}, 200


def generateToken(id):
    print("Token generation")
    access_token = create_access_token(
        identity=id, expires_delta=timedelta(days=30))
    resp = jsonify({'_id': id, 'token': access_token})
    set_access_cookies(resp, access_token)
    return access_token


@app.route('/v1/validate-otp', methods=['POST'])
def validate_otp():
    data = request.get_json()
    print(data)
    get = db.users.find_one({'email': data['email']})
    if not check_has_value(data['otp'],get['otp']):
        return {'status': 'failed', 'message': "Invalid OTP"}, 400
    print('Verified',)
    access_token = generateToken(str(get['_id']))
    return jsonify({'status': 'success', 'token': access_token}), 200


@app.route('/v1/login-wallet', methods=['POST'])
def wallet_login():
    data = request.get_json()
    print(data)
    get = db.users.find_one({'address': data['address']})
    if not get:
        return {},400
    print('Verified', get)
    access_token = generateToken(str(get['_id']))
    return jsonify({'status': 'success', 'token': access_token}), 200


@app.route('/v1/read', methods=['POST'])
def read():
    data = db.users.find()
    data = [i for i in data]
    print(data[0])
    return {"data": data}, 200


@app.route('/v1/login', methods=['POST'])
def login():
    data = request.get_json()
    print(data)
    form = LoginForm(data=data, csrf_enabled=False)
    if not form.validate():
        form.errors, 401
    print(data['email'], data['password'])
    get_data = db.users.find_one({'email': data['email']})
    if not  get_data:
        return {
            'validate': 'Invalid Credentials'
        }, 401
    if not check_has_value(data['password'],get_data['password']):
        db.users.update_one({"email":data['email']},{'$set':{'attempts':get_data['attempts']+1}})
        
        return {
            'validate': 'Invalid Credentials'
        }, 401

    otp,msg=generateOtp()

    # data['is_activated']=False
    print(otp,'OTP')
    db.users.update_one({'_id': get_data['_id']}, {'$set': {'otp': hash_value(otp)}})
    
    send_message( data['email'],'OTP for Leylines',otp)
    return jsonify({'status': 'success', 'email': data['email']}), 200


@app.route("/v1/logout")
@jwt_required()
def logout():
    res = jsonify({"msg": "logout"})
    unset_jwt_cookies(res)
    return res


@app.route("/v1/connect-wallet", methods=['POST'])
@jwt_required()
def connect_wallet():
    data = request.get_json()
    print(data)
    address = data['address']
    user_id=get_jwt_identity()
    check = db.users.find_one({"address": address})
    if check:
        return {}, 400
    db.users.update_one({"_id": ObjectId(user_id)}, {
                        "$set": {"address": address, "wallet": True}})
    return {}, 200


@app.route("/v1/get-privacy-settings")
@jwt_required()
def get_privacy_settings():
    user_id=get_jwt_identity()

    data=db.users.find_one({"_id":ObjectId(user_id)})
    data={
        'account_sharing':data['account_sharing'],
        'open':data['open'],
        'post_sharing':data['post_sharing'],
        'profile_spy':data['profile_spy'],
        'search_visibility':data['search_visibility']

    }

    return jsonify(data),200

@app.route("/v1/save-privacy-settings",methods=['POST'])
@jwt_required()
def save_privacy_settings():
    user_id=get_jwt_identity()

    data=request.get_json()
    print(data)

    db.users.update_one({'_id':ObjectId(user_id)},{"$set":data})

    return jsonify(data),200


@app.route("/v1/online")
@jwt_required()
def online():
    user_id=get_jwt_identity()
    db.users.update_one({"_id":ObjectId(user_id)},{"$set":{"online":datetime.now()}})
    return {},200

    

@app.route("/v1/update-profile",methods=['POST'])
@jwt_required()
def update_profile():
    user_id=get_jwt_identity()
    data=request.get_json()
    user=db.users.find_one({"_id":ObjectId(user_id)})
    data['user_id']=user_id
    form=EditProfile(data=data,csrf_enabled=False)
    if not form.validate():
        print(form.errors)
        return form.errors,400
    flag=0
    data.pop('user_id')
    for k,v in data.items():
        if data[k]!=user[k]:
            user[k]=data[k]
            flag=1
    if not flag:
        return {'message':"No new changes to be applied"},200
    else:
        db.users.update_one({"_id":ObjectId(user_id)},{"$set":user})
    return {},200


@app.route('/v1/forgot-password',methods=['POST'])
def forgot_password():
    data=request.get_json()
    user=db.users.find_one({'email':data['email']})
    if not user:
       return  {'data':'No user found '},422
    otp,msg=generateOtp()
    print(otp,'otp')
    send_message( data['email'],'OTP for Leylines',msg)
    db.users.update_one({'_id':user['_id']},{'$set':{'otp':hash_value(otp)}})
    return {},200
def password_check(data):
    error=[] 
    password=data
    print(password)
    # if len(password)<8:
    #     error.append('Password should have more then 8 characters.')
    pattern='[A-Z]+[a-z]'
    if re.search(pattern, password)==None:
        error.append('Password Should Contain an uppercase character.')

    regex = re.compile('[@_!#$%^&*()<>?/\|}{~:]')
    if regex.search(password)==None:
        error.append('Password Should Contain a special character.')
    print(error)
    if len(error)>0:
        return error
    return False
@app.route('/v1/change-password',methods=['POST'])
def change_password():
    data=request.get_json()
    user=db.users.find_one({'email':data['email']})
    if not user:
        {'data':'No user found '},422
    check_password=password_check(data['password'])
    if check_password:
        
        return {'data':"\n".join(check_password)},422

    if not check_has_value(data['otp'],user['otp']):
        {'data':'Invalid OTP'},422
    db.users.update_one({'_id':user['_id']},{'$set':{'password':hash_value(data['password'])}})
    return {},200