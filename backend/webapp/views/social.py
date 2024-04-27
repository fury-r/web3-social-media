import codecs
from datetime import datetime
from getpass import getuser
import math
from pickle import TRUE
from random import random
import re
from unittest import result
from bson.objectid import ObjectId
from flask_pymongo import PyMongo
from webapp import app, db, fs
import smtp
from flask import request, jsonify
from webapp.forms.user import UserForm, LoginForm
from flask_jwt_extended import create_access_token, set_access_cookies, jwt_required, unset_jwt_cookies, get_jwt_identity
import pymongo
from webapp.helpers.encryption import decrypt_text, encrypt_text

from webapp.views.content import get_nft_image


@app.route('/v1/search', methods=['POST'])
@jwt_required()
def search():
    data = request.get_json()
    user_id=get_jwt_identity()
    search = data['search']
    result = []
    check_search=db.users.find_one({'_id':ObjectId(user_id)},{'search_visibility':1})
    if len(search) > 0 and not check_search['search_visibility']:
        query = db.users.aggregate([{
            '$match': {
                'username': {'$regex': search}

            }
        },
            {
            '$project': {
                "id": {
                    '$toString': "$_id"
                },
                'username': '$username', "_id": 0,'profile_picture':1
            },
        }
        ])
        result = list(query)
    return jsonify(result), 200


@app.route('/v1/follow-user', methods=['POST'])
@jwt_required()
def follow_user():
    flag = 0
    data = request.get_json()
    print(data, 'aaaa')
    user_id = get_jwt_identity()

    print(user_id, ObjectId(user_id))
    get_user_details = db.users.find_one(
        {'username': data['username']}, {'_id': 1, 'open': 1})
    print(get_user_details)
    if data['follow'] <= 1:
        if (get_user_details['open']):
            db.connections.insert({'user_1': ObjectId(
                user_id), 'user_2': get_user_details['_id'], 'date': datetime.now()})
            activity(user_id, str(get_user_details['_id']), 0, '')

        else:
            db.requests.insert({'user_1': ObjectId(
                user_id), 'user_2': get_user_details['_id'], 'date': datetime.now()})

    elif data['follow'] == 4:

        db.connections.delete_one({"user_1": ObjectId(user_id)})

    elif data['follow'] == 3:
        db.requests.delete_one({"user_1": ObjectId(user_id)})

    return {'status': 'success'}, 200


@app.route('/v1/get-requests')
@jwt_required()
def get_request():

    user_id = get_jwt_identity()
    requests = db.requests.distinct('user_1', {'user_2': ObjectId(user_id)})
    requests = list(db.users.find({"_id": {'$in': requests}}, {'username': 1, "id": {
        '$toString': "$_id"
    }, '_id': 0, 'date': 1}))

    return jsonify(list(requests)), 200



@app.route('/v1/reply-comments',methods=['POST'])
@jwt_required()
def reply_comments():
    data=request.get_json()
    id,comment=data
    user_id=get_jwt_identity()
    comment=db.comments.find_one({"_id":ObjectId(id)})
    if not comment:
        return {},422
    c=0
    if  'replies'  in data.keys():
        c=len(data['replies'].keys())
    db.comments.update_one({'_id':ObjectId(id)},{'replies':{
        c:{
            'user_id':ObjectId(user_id),
            'comment':comment
        }
    }})
    return {},200



@app.route('/v1/requests-response', methods=['POST'])
@jwt_required()
def request_response():
    data = request.get_json()
    user_id = ObjectId(get_jwt_identity())
    id = ObjectId(data['_id'])
    if data['action'] == 1:

        db.requests.delete_one({'user_1': ObjectId(id)})

    db.requests.insert_one(
        {'user_1': ObjectId(id), 'user_2': user_id, 'date': datetime.now()})

    activity(str(id), get_jwt_identity(), 0, "")
    activity(get_jwt_identity(), str(id), 4, "")

    return {}, 200


@app.route('/v1/get-requests-count')
@jwt_required()
def get_request_count():
    data = request.get_json()
    user_id = get_jwt_identity()
    data = db.users.find_one({'_id': ObjectId(user_id)})
    count = len(data['requests']) if 'requests' in data.keys() else 0
    return jsonify(count), 200


def get_image(img):
    row = {}
    image = fs.get(ObjectId(img['id']))
    base64 = codecs.encode(image.read(), 'base64')
    image = base64.decode("utf-8")
    row['image'] = image
    row['type'] = img['type']
    row['height'] = img['dim']['height']
    row['width'] = img['dim']['width']
    return row


def get_friends(user_id):
    data = []
    try:
        followers = db.connections.distinct(
            'user_1', {'$or': [{'user_1': user_id}, {'user_2': user_id}]},)
        print(followers)
        followers = db.users.find({'_id': {'$in': list(followers)}}, {
                                'id': {'$toString': '$_id'}, 'username': 1, '_id': 0, 'profile_picture': 1})
        for row in list(followers):
            row["profile_pic"] = False
            if len(row['profile_picture']) > 0:
                row.update(get_image(row['profile_picture']))
            data.append(row)

        return {'data': data}
    except Exception as e:
        print(e)
        return {'data':[]}


def getTimedifference(created_at):
    time = created_at
    if isinstance(time, str):
        time = datetime.fromisoformat(time)
    today = datetime.now()
    difference = today-time
    message = 'Now'
    time_difference = today-time

    time_difference = str(time_difference).split(":")

    hour = int(time_difference[0][-1])
    minute = int(time_difference[1])
    second = int(float(time_difference[2]))
    if int(difference.days == 0 and second == 0 and hour == 0 and minute == 0):
        return "Now"
    if int(difference.days) == 0:

        if (hour) == 0 and minute > 0:
            if minute == 1:
                message = str(minute)+" minute ago"
            else:
                message = str(minute)+" minutes ago"

        elif hour == 1:
            message = str(hour)+" hour ago"
        elif hour > 1:
            message = str(hour)+" hours ago"

        elif(minute == 0):
            if second == 1:
                message = str(second)+" second ago"
            else:
                message = str(second)+" seconds ago"

    elif int(difference.days) == 1:
        message = "yesterday"

    else:
        message = str(difference.days)+" days ago"

    return message


@app.route("/v1/open-conversations")
@jwt_required()
def open_conversations():
    user_id = ObjectId(get_jwt_identity())
    messages = db.conversations.find(
        {"$or": [{"user_1": user_id}, {"user_2": user_id}]})
    user = ''
    result = []
    for row in messages:
        conversation = db.messages.find_one({"msg_id": str(row['_id'])})
        if user_id == row["user_1"]:
            user = db.users.find_one({"_id": ObjectId(row["user_2"])})
        else:
            user = db.users.find_one({"_id": ObjectId(row["user_1"])})

        unseen = db.messages.find({"$and": [{"msg_id": str(row['_id'])}, {
                                  "seen": False}, {"user_2": user_id}]}).count()
        time = getTimedifference(user['online'])

        row = {"id": str(row["_id"]), "username": user['username'],
               "unseen": unseen, "msg": "", "active": False, 'img': False}
        if user['visible']:
            if 'seconds' in getTimedifference(user['online']):
                row['active'] = True
        if user['visible'] == False:
            row['active'] = False
        if conversation:
            row.update({'msg': conversation['msg'], 'time': getTimedifference(
                conversation['datetime'])})
        if len(user['profile_picture']) > 0:
            print("im in")
            row['img'] = True
            row.update(get_image(user['profile_picture']))
        result.append(row)

    result = {'mode': 1, 'data': result}

    if len(result['data']) == 0:
        result = get_friends(ObjectId(user_id))
    return result, 200


@app.route("/v1/get-message")
@jwt_required()
def get_messages():
    user_id = ObjectId(get_jwt_identity())
    id = request.args.get('id')
    user_2 = db.users.find_one({"username": id})
    id = ObjectId(user_2['_id'])
    blocked=db.blocked.find_one({'user_1':user_id,'user_2':id})
    restricted=db.restricted.find_one({'user_1':user_id,'user_2':id})

    result = []
    messages_list=db.messages.find({'$or':[{'user_1':user_id,'user_2':id},{'user_1':id,'user_2':user_id}]})

    if messages_list:
        db.messages.update_many({'$or':[{'user_1':user_id,'user_2':id},{'user_1':id,'user_2':user_id}]}, {"$set": {"seen": True}})

        for data in messages_list:
            row = {"id": str(data["_id"]), "msg": decrypt_text(data["msg"],str(data['msg_id']),data['nonce']), "user": 1,'seen':data['seen']}

            if data['user_1'] != user_id:
                row['user'] = 2
            result.append(row)

    return jsonify({'data': result, 'blocked': False if  not blocked else True, 'restricted': False if not restricted else True, 'username': user_2['username']}), 200

#
@app.route("/v1/send-message", methods=['POST'])
@jwt_required()
def send_messages():
    user_id = ObjectId(get_jwt_identity())
    data = request.get_json()
    print(data)
    user = db.users.find_one({"username": data["id"]})
    data["id"] = user['_id']
    # block and restrict and unknown conditions
    blocked = db.blocked.find_one({'user_1': user_id, 'user_2': user['_id']})
    restricted = db.blocked.find_one(
        {'user_1': user_id, 'user_2': user['_id']})

    if blocked or restricted:
        return {'message': 'You cannot text this user'}, 200
    messages = db.conversations.find_one({"$or":
                                         [
                                             {"$and":
                                              [
                                                  {"user_1": user_id
                                                   }, {
                                                      "user_2": data['id']
                                                  },
                                              ]}, {"$and":
                                                   [
                                                       {"user_1": data['id']
                                                        }, {
                                                           "user_2": user_id
                                                       },
                                                   ]}]})

    id = ""
    if not messages:

        id = db.conversations.insert_one(
            {"user_1": user_id, "user_2": data["id"], "datetime": datetime.now()})
        id = db.conversations.find_one(
            {"$and": [{"user_1": user_id}, {"user_2": data["id"]}]})
    else:
        id = messages["_id"]
    encoded,nonce,tag=encrypt_text(data['msg'],str(id))
    print({

        "msg_id": id,
        "user_1": user_id,
        "user_2": data['id'],
        "msg": data['msg'],
        "seen": False,
        "datetime": datetime.now()
    })
    db.messages.insert_one({

        "msg_id": id,
        "user_1": user_id,
        "user_2": data['id'],
        "msg": encoded,
        'nonce':nonce,
        'tag':tag,
        "seen": False,
        "datetime": datetime.now()
    })
    return {}, 200


@app.route("/v1/unsend-message")
@jwt_required()
def unsend_messages():
    id = request.args.get('id')

    user_id = get_jwt_identity()
    message = db.messages.find_one({"user_1": ObjectId(user_id)})
    print(message)
    if message:
        db.messages.delete_one({"_id": ObjectId(id)})
    else:
        return {}, 400

    return {}, 200


@app.route("/v1/get-profile/<mode>")
@jwt_required()
def get_profile(mode):
    user_id = get_jwt_identity()
    mode = int(mode)
    print('mode', mode)
    mint = True if mode == 2 else False
    print(mint)
    user = list(
        db.users.aggregate([
            {'$match': {'_id': ObjectId(user_id)}},

            {'$lookup': {
                'from': 'comment',
                'localField': '_id',
                'foreignField': 'user_id',
                'as': 'content',

            }},

            {'$lookup': {
                'from': 'connections',
                'let': {
                    'user_1': '$user_1',
                    'user_2': '$user_2',

                },
                'pipeline': [

                    {
                        '$project': {
                            'user_1': {'$cond': [{'$eq': ['$user_1', ObjectId(user_id)]}, 1, 0]},
                            'user_2':{'$cond': [{'$eq': ['$user_2', ObjectId(user_id)]}, 1, 0]},

                        }
                    }, {
                        '$group': {
                            '_id': None, 'following': {'$sum': '$user_1'},
                            'followers': {'$sum': '$user_2'}

                        }
                    }
                ],
                'as': 'connections'
            }},
            {'$lookup': {
                'from': 'content',
                'localField': '_id',
                'foreignField': 'user_id',

                'pipeline':    [
                    {'$match': {'mint': mint}},
                    {'$sort': {'datetime': -1}}],

                'as': 'content',

            }},




        ])
    )[0]
    print(user['content'])
    content = user['content']
    count = user['connections']
    count = list(count)
    print(content, '')
    if len(count) == 0:
        count = {

            'following': 0, 'followers': 0
        }
    else:
        count = count[0]

    row = {"followers": count['followers'], "following": count['following'],
           "username": user['username'], 'desc': user['desc']}



    profile_pic = user['profile_picture']
    if len(profile_pic) > 0:
        row.update(get_image(profile_pic))


    return jsonify(row), 200



def get_profile_content(user_id,mode):
    mint=True if mode==2 else False
    #user=db.users.find_one({'_id':ObjectId(user_id)})

    content=db.content.find({'user_id':ObjectId(user_id),'mint':mint})
    result=[]
    if not content:
        return {},422
    for i in content:
        data={}
        comments = db.comments.find({"content_id": str(i["_id"])})
        if comments:
            comments = comments.count()
        else:
            comments = 0
        data = {"id": str(i["_id"]), "likes": len(i['likes']), "comments": comments, "type": i['type'],
                    "desc": i['desc'], 'name': i['name'], 'dim': i['dim'], "mint": i['mint'], "datetime": i['datetime']}
        
        if mode == 1:
            img = fs.get(ObjectId(i['content_id']))
            base64_data = codecs.encode(img.read(), 'base64')
            image = base64_data.decode("utf-8")
            data['img']=image
        else:
            print("mint--------",i['_id'])
            #data = {"id": str(i["_id"]), "likes": len(i['likes']), "comments": comments, "img": '',
                    #"type": i['type'], "desc": i['desc'], 'name': i['name'], 'mint': i['mint'], 'dim': i['dim'],'tokenId':i['tokenId']}
            data['img']=get_nft_image(i['tokenId'])
            data['tokenId']=i['tokenId']


        result.append(data)
    return result
@app.route('/v1/profile-posts/<mode>',methods=['POST'])
@jwt_required()
def profile_posts(mode):
    mode=int(mode)
    user_id=get_jwt_identity()
    data=request.get_json()
    if data:
        user_id=data['id']
    result=get_profile_content(user_id,mode)
    return jsonify(result),200


@app.route("/v1/get-user-profile", methods=['POST'])
@jwt_required()
def get_user_profile():
    data = request.get_json()
    print(data)
    user = data['user']
    user_id = get_jwt_identity()
    mode = False

    if 'mode' in data.keys():
        mode = int(data['mode'])
        mint = True if mode == 2 else False

    user = list(
        db.users.aggregate([
            {'$match': {'_id': ObjectId(user)}},


            {'$lookup': {
                'from': 'connections',
                'let': {
                    'user_1': '$user_1',
                    'user_2': '$user_2',

                },
                'pipeline': [

                    {
                        '$project': {
                            'user_1': {'$cond': [{'$eq': ['$user_1', ObjectId(user)]}, 1, 0]},
                            'user_2':{'$cond': [{'$eq': ['$user_2', ObjectId(user)]}, 1, 0]},

                        }
                    }, {
                        '$group': {
                            '_id': None, 'following': {'$sum': '$user_1'},
                            'followers': {'$sum': '$user_2'}

                        }
                    }
                ],
                'as': 'connections'
            }},


            {'$lookup': {
                'from': 'blocked',
                'let': {
                    'user_id': '$_id'
                },

                'pipeline': [{'$match': {'user_1': ObjectId(user_id), 'user_2': '$user_id'}}],
                'as': 'blocked'
            }},
            {'$lookup': {
                'from': 'restricted',
                'let': {
                    'user_id': '$_id'
                },

                'pipeline': [{'$match': {'user_1': ObjectId(user_id), 'user_2': '$user_id'}}],
                'as': 'restricted'
            }},
            {'$lookup': {
                'from': 'content',
                'localField': '_id',
                'foreignField': 'user_id',

                'pipeline':    [

                    {'$match': {'mint': mint}},
                    {'$sort': {'datetime': -1}}],

                'as': 'content',

            }},
            {'$lookup':{
                'from':'bids',
                'localField':'content_id',
                'foreignField':"content_id",
                'as':'bids'
            }}

        ])
    )[0]

    id = user['_id']
    content = user['content']
    count = {}
    count = user['connections']

    count = list(count)
    if len(count) == 0:
        count = {

            'following': 0, 'followers': 0
        }
    else:
        count = count[0]
    row = {"followers": count['followers'], "following": count['following'], "username": user['username'],
           'blocked': False, 'restricted': False, 'profile_pic': False, 'desc': user['desc'], 'access': 1,'address':user['address']}
    result = []
    c = 0
    row['follow'] = 0
    follower = db.connections.find_one({"user_1": id}, {'_id': 1})
    following = db.connections.find_one({"user_2": id}, {'_id': 1})
    requests = db.requests.find_one({"user_2": id}, {'_id': 1})

    if follower and not following:
        row['follow'] = 1

    if requests:
        row['follow'] = 3
    if (follower and following) or (following and not follower):
        row['follow'] = 4

    count = []
    main = []
    print(user['blocked'], 'nlocked')
    if len(user['blocked']) > 0:
        row['blocked'] = True
    if len(user['restricted']) > 0:
        row['restricted'] = True

    print(content)
    for i in content:
        img = fs.get(ObjectId(i['content_id']))
        base64_data = codecs.encode(img.read(), 'base64')
        image = base64_data.decode("utf-8")
        comments = db.comments.find({"content_id": str(i["_id"])})
        if comments:
            comments = comments.count()
        else:
            comments = 0
        # if mode == 1:
        #     record = {"id": str(i["_id"]), "likes": i['likes'], "comments": comments, "img": image,
        #               "type": i['type'], "desc": i['desc'], 'name': i['name'], 'dim': i['dim']}
        # else:
        #     record = {"id": str(i["_id"]), "likes": i['likes'], "comments": comments, "img": image,
        #               "type": i['type'], "desc": i['desc'], 'name': i['name'], 'price': i['price'], 'bid': i['bid']}
        #     bids = list(db.bids.find(
        #         {"content_id": ObjectId(record['id'])}).sort("_id", -1).limit(1))
        #     if len(bids) > 0:
        #         print("in")
        #         record['price'] = list(bids)[0]['price']
        #     print(record['price'])


    profile_pic = user['profile_picture']
    if len(profile_pic) > 0 and len(user['blocked'])==0:
        row.update(get_image(profile_pic))
    if user['profile_spy'] and user_id != str(user['_id']):
        user['profile_view'][str(datetime.now())] = user_id
        db.users.update_one({"_id": user['_id']}, {
                            "$set": {"profile_view": user['profile_view']}})


    return jsonify(row), 200


@app.route("/v1/get-visibility")
@jwt_required()
def get_visibility():
    user_id = get_jwt_identity()

    get_user = db.users.find_one({"_id": ObjectId(user_id)})

    data = {
        'visible': get_user['visible']
    }
    return jsonify(data), 200


@app.route("/v1/change-visibility", methods=['POST'])
@jwt_required()
def change_visibility():
    user_id = get_jwt_identity()
    data = request.get_json()
    print(data['visible'], 'activity')
    db.users.update_one({"_id": ObjectId(user_id)}, {
                        "$set": {"visible": data['visible']}})

    return {}, 200


@app.route("/v1/account-action", methods=['POST'])
@jwt_required()
def account_action():
    user_id = ObjectId(get_jwt_identity())
    data = request.get_json()
    mode = int(data['mode'])
    user_2 = db.users.find_one({"username": data['username']})

    if mode == 1:
        blocked = db.blocked.find_one(
            {'user_1': user_id, 'user_2': user_2['_id']})

        if not blocked:
            db.blocked.insert_one({
                'user_1': user_id, 'user_2': user_2["_id"], 'date': datetime.now()
            })
        else:
            db.blocked.delete_one({'user_1': user_id, 'user_2': user_2['_id']})

    elif mode == 2:
        restricted = db.restricted.find_one(
            {'user_1': user_id, 'user_2': user_2['_id']})

        if not restricted:

            db.restricted.insert_one({
                'user_1': user_id, 'user_2': user_2["_id"], 'date': datetime.now()
            })
        else:
            db.restricted.delete_one(
                {'user_1': user_id, 'user_2': user_2['_id']})

    return {}, 200


@app.route("/v1/get-profile-viewers")
@jwt_required()
def profile_viewer():
    user_id = get_jwt_identity()
    data = db.users.find_one({"_id": ObjectId(user_id)},{'profile_view':1})
    print(data)
    result = []
    result=[]
    print(list(map(ObjectId,data['profile_view'].values())),)
    user = list(db.users.find({"_id": {'$in':list(map(ObjectId,data['profile_view'].values()))}},{'profile_picture':1,'username':1}))
    keys=list(data['profile_view'].keys())
    user={str(i['_id']):i for i in user}
    print(user,len(keys))
    for k in  range(len(keys)):
        u=user[data['profile_view'][keys[k]]]
        time = getTimedifference(keys[k])
        row = {
            'username':u['username'],
            'time': time,
            "profile_pic": False


        }
        if len(u['profile_picture']) > 0:
            row['profile_pic']=True
            row.update(get_image(u['profile_picture']))
        print(row.keys(),row['profile_pic'])
        result.append(row)
    
    return jsonify(result), 200


@app.route("/v1/clear-profile-viewers")
@jwt_required()
def clear_views():
    user_id = get_jwt_identity()
    db.users.update_one({"_id": ObjectId(user_id)}, {
                        "$set": {'profile_view': {}}})

    return {}, 200


def activity(user_id_1, user_id_2, type, content):
    # 0-following 1-likes 2-comments
    db.activity.insert_one({'user_1': user_id_1, 'user_2': user_id_2,
                           'type': type, 'content': content, 'timestamp': datetime.now()})
    return True


def get_list(user_id, data, mode):
    print(data, mode)
    accounts = ''
    conditions=['user_2','user_1']
    if data['mode'] == 1:
        conditions=['user_1','user_2']
    if mode == 0:
        accounts = db.connections.aggregate([
            {'$match':{conditions[0]:ObjectId(user_id)}},

                {
                    '$lookup':      {
                'from':'users',
                'localField':conditions[1],
                'foreignField':'_id',
                
                'as':'users'
            },
                },
            {'$unwind':'$users'},
            {
                '$project':{
                    'users.username':1,
                    'users.profile_picture':1
                }
            }
        ])
    else:
       accounts = db.users.aggregate([
            {'$match':{'username':user_id}},
            {
                '$lookup':     {
                'from':'connection',
                'localField':'_id',
                'foreignField':conditions[0],
                'as':'user'
            },
            },
            {'$unwind':'$user'},
            {
                '$lookup': {
                'from':'users',
                'localField':conditions[1],
                'foreignField':'_id',
                'as':'users'
            }
            },
            {
                '$project':{
                    'users._id':1,
                    'username':1,
                    'profile_picture':1
                }
            }
        ])
    if not accounts:
        return {},200
    accounts=list(accounts)
    print(accounts)

    result = []
    for row in accounts:
        id=row['_id']
        user=row['users']
        row = {
            'username': user['username'],
            'img': False
        }
        row['follow'] = 0
        follower = db.connections.find_one({"user_1": id}, {'_id': 1})
        following = db.connections.find_one({"user_2": id}, {'_id': 1})
        requests = db.requests.find_one({"user_2": id}, {'_id': 1})

        if follower and not following:
            row['follow'] = 1

        if requests:
            row['follow'] = 3
        if (follower and following) or (following and not follower):
            row['follow'] = 4
        if len(user['profile_picture']) > 0:
            row.update(get_image(user['profile_picture']))
        result.append(row)
    return result


@app.route("/v1/get-activity")
@jwt_required()
def get_activity():
    user_id = get_jwt_identity()

    data = db.activity.aggregate([
        {'$match': {"user_2": ObjectId(user_id)}},
        {'$lookup': {
            'from': 'users',
            'localField': 'user_1',
            'foreignField': '_id',
            'as': 'user'
        }},


        {'$project': {
            'user.username': 1,
            'user.profile_picture': 1,
            'timestamp': 1,
            'content':1,
            'user_1': 1,
            'user_2': 1,
            'type': 1,
            'content':1,
            'address':1,
        }}
    ])
    result = []
    for row in data:
        print(row)
        if len(row['user'])==0:
            continue
        user = row['user'][0]
        
        time = getTimedifference(row['timestamp'])
        record = {
            'id': str(row['_id']),
            'username': user['username'],
            'time': time,
            'img': False,
            
            'profile': {

            },
            'type':row['type'],
        }
        if row['type'] == 0:
            record['message'] = 'started following you',

            if len(user['profile_picture']) > 0:
                record.update(get_image(user['profile_picture']))
        elif row['type'] == 1:

            record['message'] = 'liked your photo',

            record.update(get_image(user['profile_picture']))

        elif row['type'] == 2:
            record['message'] = 'commented on your photo',

            record.update(get_image(user['profile_picture']))
        elif row['type'] == 3:

            bid = db.bids.find_one( {"content_id": row['_id']})
            print(row['_id'])
            if bid:
                record['message'] = 'has an offer for your NFT'

                record['bid'] = bid['price']
                record['bid_id'] = str(bid['_id'])

                if len(user['profile_picture']) > 0:
                    record.update(get_image(user['profile_picture']))
        elif row['type'] == 4:
            record['message'] = 'Accepted your follow request'
        elif row['type'] == 5 :
            
            print(row['content'],user_id)
            user_address = list(db.bids.aggregate([
                {'$match':{"_id": row['content']}},
                {'$lookup':{
                    'from':'users',
                    'localField': 'user_id',
                    'foreignField': '_id',
                    'as': 'user'
                }},
                              {'$lookup':{
                    'from':'content',
                    'localField': 'content_id',
                    'foreignField': '_id',
                    'as': 'content'
                }}
                ,{
                    '$project':{
                        'user.address':1,
                        'price':1,
                        'content.bid':1,
                        'status':1
                    }
                }
            ]))[0]
            print(user_address,'address')
            if len(user_address['content'])>0 and user_address['content'][0]['bid']:
                record['bid']=user_address['price']
                record['message'] = ' has accepted your bid '
                record['address']=user_address['user'][0]['address']
                record['bid_id']=str(row['content'])
                record['status']=user_address['status']

        if len(user['profile_picture']) > 0:
            record['profile'].update(get_image(user['profile_picture']))

        print(result)
        if 'message' in record.keys():
            result.append(record)
    return jsonify(result), 200


@app.route("/v1/user-list", methods=["POST"])
@jwt_required()
def user_list():
    user_id = get_jwt_identity()
    data = request.get_json()
    print(data)
    id=''
    flag = 0
    if data['id'] != '0':
        user_id = data['id']
        flag = 1
    data = get_list(user_id, data, flag,)
    return jsonify(data), 200


@app.route("/v1/delete-activity/<id>")
@jwt_required()
def delete_activity(id):
    print(id)
    user_id = get_jwt_identity()

    delete = db.activity.delete_one(
        {'$and': [{"user_2": user_id}, {'_id': ObjectId(id)}]})
    print(delete)
    if not delete:
        return {}, 404
    return {}, 200


@app.route("/v1/get-bids/<id>")
@jwt_required()
def get_bids(id):
    print(id)
    user_id = get_jwt_identity()
    bids = db.bids.find({"content_id": id}).sort("_id", -1)
    if not bids:
        return {}, 404
    result = [{
        'id': str(row["_id"]),
        'address':row['address'],
        'price':row['price']
    } for row in bids]

    return jsonify(result), 200
