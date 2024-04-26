from datetime import datetime
import os
from PIL import Image
from bson.objectid import ObjectId
import requests
from webapp import app, db,fs
from flask import request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.utils import secure_filename
import codecs

from webapp.helpers.encryption import decrypt_text, encrypt_text

headers={'x-api-key':os.getenv("api_Key_moralis")}

def check_extension(extension):
    print(extension,'extension')
    if extension  not in app.config['UPLOAD_EXTENSIONS']:
        return False
    return True

@app.route("/v1/upload-file",methods=['POST'])
@jwt_required()
def upload_file():
    print(request.files,type(request.files['image']))
    data=request.files['image']
    filename = secure_filename(data.filename) # save file 
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename);
    f=request.form

    if not check_extension(f['type']):
        return {"msg":"File not supported"},400
    data.save(filepath)
 
    user_id=get_jwt_identity()
  
    image=Image.open(filepath)
    width,height=image.size
    if width>1080:
        width=1080
    if height>1350:
        height=1350
    image=image.resize((width,height),Image.ANTIALIAS)
    os.remove(filepath)
    image.save(filepath,quality=95)
    image.close()

    print("Save Compressed----------------------------------")
    file=open(filepath,"rb")
    contents=file.read()
    id=fs.put(contents,filename=user_id,type=f['type'])
    db.content.insert_one({"user_id":ObjectId(user_id),"content_id":id,"likes":{},"datetime":datetime.now(),'owners':[],"name":user_id,"type":f['type'],"dim":{"width":width,"height":height},"desc":f['desc'],"mint":False,"tokenId":"","bid":False,'price':0.0,'minted_on':None})
    file.close()

    return {},200



def activity(user_id_1,user_id_2,type,content):
    #0-following 1-likes 2-comments 
    db.activity.insert_one({'user_1':user_id_1,'user_2':user_id_2,'type':type,'content':content,'timestamp':datetime.now()})
    return True


def get_nft_image(tokenId):
    url=f'https://deep-index.moralis.io/api/v2/nft/0xD9Cf9dd3F7dd524eC7554989d110B73758414984/{tokenId}?chain=rinkeby&format=decimal'
    res=requests.get(url,headers=headers).json()
    res=requests.get(res['token_uri']).json()
    return res['image']

def get_nft__owners(token):
    url=f'https://deep-index.moralis.io/api/v2/nft/0xD9Cf9dd3F7dd524eC7554989d110B73758414984/{token}/owners?chain=rinkeby&format=decimal'
    res=requests.get(url,headers=headers).json()
    res=requests.get(res['token_uri']).json()
    result=[]
    for row in res['result']:
        row={
            'address':''
        }
    return res['image']
@app.route("/v1/get-content")
@jwt_required()
def get_content():
    user_id=get_jwt_identity()
    userData=db.users.find_one({"_id":ObjectId(user_id)})
    print(user_id)

    
    content=list(db.connections.aggregate([
        {'$match':{'user_1':ObjectId(user_id)}},
        {'$lookup':{
            'from':'content',
            'localField':'user_2',
            'foreignField':'user_id',
            'as':'posts',
     
        }},
        {'$unwind':'$posts'},
    
        {
            '$lookup':{
                'from':'users',
                'localField':'user_2',
                'foreignField':'_id',
                'as':'user_info'
            }
        },
                {'$unwind':'$user_info'},
        {'$unwind':'$posts'},

 

    ]))
    user_content=list(db.users.aggregate([
        {'$match':{'_id':ObjectId(user_id)}},
        {'$lookup':{
            'from':'content',
            'localField':'_id',
            'foreignField':'user_id',
            'as':'posts'
        }
        }
        
    ]))[0]
    user_content={'posts':user_content.pop("posts"),'user_info':user_content}
    #print(user_content)
    #content.append(user_content)
    result=[]
    for row in content:   
        #remove  this condition    
        if 'user_info' in row.keys():
            user=row['user_info']
            post=row['posts']
            print(post)
            comments=db.comments.find({"content_id":post['_id']})
            if comments:
                comments=comments.count()
            else:
                comments=0
            data={"id":str(post['_id']),
            "content_id":str(post['content_id']),"likes":len(post['likes'])
            ,'comments':comments,"type":post['type'],"dim":post['dim'],"liked":False,"desc":post['desc'],"username":user['username'],'time':getTimedifference(post['datetime']),'date':post['datetime'],'img':''}
            data['username']=user['username']
            if user_id in post['likes'].keys():
                data['liked']=True
            if post['mint']:
                image=get_nft_image(post['tokenId'])
            else:
                img=fs.get(ObjectId(post['content_id']))
                base64_data = codecs.encode(img.read(), 'base64')
                image=base64_data.decode("utf-8")
    
            data['img']=image
            result.append(data) 
    user=user_content.pop('user_info')
    for post in user_content['posts']:
            comments=db.comments.find({"content_id":post['_id']})
            if comments:
                comments=comments.count()
            else:
                comments=0
            data={"id":str(post['_id']),
            "content_id":str(post['content_id']),"likes":len(post['likes'])
            ,'comments':comments,"type":post['type'],"dim":post['dim'],"liked":False,"desc":post['desc'],"username":user['username'],'time':getTimedifference(post['datetime']),'date':post['datetime']}
            data['username']=user['username']
            if user_id in post['likes'].keys():
                data['liked']=True
            if post['mint']:
                data['img']=get_nft_image(post['tokenId'])
            else:
                    
                img=fs.get(ObjectId(post['content_id']))
                base64_data = codecs.encode(img.read(), 'base64')
                image=base64_data.decode("utf-8")
        
                data['img']=image
            result.append(data) 
    result=sorted(result,key=lambda item:item['date'],reverse=True)
    return jsonify(result),200
    
@app.route("/v1/like-post",methods=['POST'])
@jwt_required()
def like():
    user_id=get_jwt_identity()
    data=request.get_json()
    print(data)
    content_id=ObjectId(data['id'])
    row=db.content.find_one({"_id":content_id})
    likes=row['likes']
    if user_id in likes:
        likes.pop(user_id)
        db.activity.delete_one({"$and":[{"user_1":row['user_id']},{"_id":row['_id']}]})
    else:
        likes[user_id]=datetime.now()
        if row['user_id']!=user_id:

            activity(user_id,row['user_id'],1,str(row['_id']))
    db.content.update({"_id":content_id},{"$set":{"likes":likes}})
    return jsonify(user_id),200

    


 



@app.route("/v1/validate-post")
@jwt_required()
def validate_post():
    user_id=get_jwt_identity()
    data=request.args.get("id")
    content_id=ObjectId(data)
    row=db.content.find_one({"$and":[{"_id":ObjectId(content_id)},{"user_id":ObjectId(user_id)}]})
    print(row)
    if not row  or row['mint']: 
        return {},422
    
    return {},200
   
@app.route("/v1/mint-post",methods=['POST'])
@jwt_required()
def mint_post():
    user_id=get_jwt_identity()
    data=request.get_json()
    print(data,user_id)
    content_id=ObjectId(data['id'])
    row=db.content.find_one({"$and":[{"_id":content_id},{"user_id":ObjectId(user_id)}]})
    if not row:
        return {},422
    fs.delete(row['content_id'])
    #row=db.content.find_one({"$and":[{"_id":content_id},{"user_id":user_id}]})
    user=db.users.find_one({"_id":ObjectId(user_id)})
    print(row)
    
    row['mint']=True
    row['tokenId']=data['tokenId']
    transactionHash=[]


    transactionHash.append(data['transactionHash'])
    db.content.update({"_id":row['_id']},{"$set":{"mint":True,"tokenId":data['tokenId'],'minted':ObjectId(user_id),'address':data['id'],'minted_on':datetime.now(),'content_id':'',}})

    return {},200



@app.route("/v1/delete-post")
@jwt_required()
def delete_post():
    user_id=get_jwt_identity()
    data=request.args.get("id")
    print(data,"Deleted")
    content_id=ObjectId(data)
    row=db.content.find_one({"$and":[{"_id":content_id},{"user_id":user_id}]})
    if not row: 
        return {},422
    fs.delete(row["content_id"]);
 
    db.content.delete_one({"$and":[{"_id":content_id},{"user_id":user_id}]})
    return {},200


@app.route("/v1/edit-post",methods=["POST"])
@jwt_required()
def edit_post():
    user_id=get_jwt_identity()
    data=request.get_json()
    content_id=ObjectId(data['id'])
    row=db.content.update_one({"$and":[{"content_id":content_id},{"user_id":user_id}]},{"$set":{"desc":data['desc']}})
    if not row: 
        return {},422
 
    return {},200

@app.route("/v1/get-post")
@jwt_required()
def get_post():
    user_id=get_jwt_identity()
    data=request.args.get("id")
    
    content_id=ObjectId(data)
    print(data)
    row=db.content.find_one({"$and":[{"content_id":content_id},{"user_id":user_id}]})
    if not row: 
        return {},422
    img=fs.get(content_id)
    base64_data = codecs.encode(img.read(), 'base64')
    image=base64_data.decode("utf-8")
    row={"img":image,"type":row['type'],'name':row['name'],"likes":len(row['likes']),'comments':row['comments'],'desc':row['desc']}
    return jsonify(row),200


@app.route("/v1/view-diary")
@jwt_required()
def view_diary():
    user_id=get_jwt_identity()
    mode=int(request.args.get("mode"))


    data=db.diary.find_one({"user_id":ObjectId(user_id)})
    if not data:
        return {},400
    data=[{'date':k,"text":" \n".join(v.values()),'last_entry':list(v.values())[-1]} for k,v in data.items() if k !='user_id' and k!='_id'] 
    data=sorted(data,key=lambda x:x['date'],reverse=True)
    if mode==1 and data[0]['date']==str(datetime.now().date()):
        return jsonify(data[0]),200
    return jsonify(data),200


@app.route("/v1/edit-diary",methods=['POST'])
@jwt_required()
def edit_diary():
    user_id=get_jwt_identity()

    data=request.get_json()
    diary=db.diary.find_one({"user_id":ObjectId(user_id)})
    print(diary)
    date=str(datetime.now().date())
    if not diary:   
        diary={
            
            'user_id':ObjectId(user_id),
            date:{
                '0':data['text']
            }
        }
        db.diary.insert_one(diary)
        return {},200

    if  date not in diary.keys():
        db.diary.update_one({"user_id":ObjectId(user_id)},{"$set":{date:{
            '0':data['text']
        }}})
    else:
        count=int(list(diary[date].keys())[-1])
        diary[date][str(count+1)]=data['text']
        db.diary.update_one({"user_id":ObjectId(user_id)},{"$set":{date:diary[date]}})
    return data,200


@app.route("/v1/upload-profile-picture",methods=['POST'])
@jwt_required()
def upload_profile_picture():

    f=request.form
    user_id=get_jwt_identity()

    user=db.users.find_one({"_id":ObjectId(user_id)})
    mode=int(f['mode'])

    if len(user['profile_picture'])>0 or mode==0:
        fs.delete(ObjectId(user['profile_picture']['id']))
        db.users.update_one({"_id":ObjectId(user_id)},{"$set":{"profile_picture":{}}})

    if mode==1:
        print(request.files)

        if not check_extension(f['type']) :
            return {'msg':"File not supported"},400
        data=request.files['image']
        filename = secure_filename(data.filename) # save file 
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename);
        data.save(filepath)


        image=Image.open(filepath)
        width,height=image.size
        if width>1080:
            width=1080
        if height>1350:
            height=1350
        image=image.resize((1080,1350),Image.ANTIALIAS)
        os.remove(filepath)
        image.save(filepath,quality=95)
        image.close()

        file=open(filepath,"rb")
        contents=file.read()
        id=fs.put(contents,filename=user_id,type=f['type'])
        db.users.update_one({"_id":ObjectId(user_id)},{"$set":{"profile_picture":{"id":str(id),"type":f['type'],'dim':{'width':width,"height":height},}}})
        file.close()
        os.remove(filepath)

    return {},200

def getTimedifference(created_at):
    time=created_at
    if isinstance(time,str):
        time=datetime.fromisoformat(time)
    print(time,'--------')
    today=datetime.now()
    difference=today-time
    message=''
    time_difference=today-time

    time_difference=str(time_difference).split(":")
    print(time_difference)

    hour=int(time_difference[0][-1])
    minute=int(time_difference[1])
    second=int(float(time_difference[2]))
    if int(difference.days==0 and second==0 and  hour==0 and minute==0) :
        return "Now"

    if int(difference.days)==0:

        if (hour)==0 and minute>0:
            if minute==1:
                message=str(minute)+" minute ago"
            else:
                message=str(minute)+" minutes ago"
    
        elif hour==1:
                message=str(hour)+" hour ago"
        elif hour>1:
            message=str(hour)+" hours ago"     
           
        elif(minute==0):
            if second==1:
                message=str(second)+" second ago"
            else:
                message=str(second)+" seconds ago"
  
    elif int(difference.days)==1:
        message=str(difference.days)+" day ago"
        
    else:
        message=str(difference.days)+" days ago"

        return message


@app.route("/v1/post-comment",methods=['POST'])
@jwt_required()
def post_comment():
    user_id=get_jwt_identity()
    data=request.get_json()
    post=db.content.find_one({"_id":ObjectId(data['content_id'])})
    print(post,data)
    if not post:
        return {},404
    user=db.users.find_one({"_id":ObjectId(post['user_id'])})
    user=list(
        db.users.aggregate([
        {'$match':{'_id':ObjectId(user_id)}},
        {'$lookup':{
            'from':'restricted',
        'let': {
                    'user_1': '$user_1',
                    'user_2': '$user_2',

                },
                'pipeline': [

                    {
                        '$project': {
                            'user_1': {'$cond': [{'$and':[{'$eq': ['$user_1',post['user_id']]},{'$eq': ['$user_2', ObjectId(user_id)]}]}, 1, 0]},

                        }
                    }, 
                ],
            'as':'restricted'
        }},
              {'$lookup':{
            'from':'blocked',
            'let': {
                    'user_1': '$user_1',
                    'user_2': '$user_2',

                },
                'pipeline': [

                    {
                        '$project': {
                            'user_1': {'$cond': [{'$and':[{'$eq': ['$user_1',post['user_id']]},{'$eq': ['$user_2', ObjectId(user_id)]}]}, 1, 0]},

                        }
                    }, 
                ],
            'as':'blocked'
        }}
    ])
    )
    if len(user)==0:
        user={
            'blocked':0,
            'restricted':0
        }
    else:
        user=user[0]
    if  user['restricted']or user['blocked']:
        return {'message':'You cannot comment on this post'},200
    crypt,nonce,tag=encrypt_text(data['comment'],user_id)
    data={
        "user_id":ObjectId(user_id),
        "likes":{

        },
        "comment":crypt,
        "timestamp":datetime.now(),
        'content_id':post['_id'],
        'nonce':nonce,
        'tag':tag,
        'replies':[
            
        ]
    }
    db.comments.insert_one(data)
    if post['user_id']!=user_id:
        activity(user_id,post['user_id'],2,data['content_id'])
    return {},200

@app.route("/v1/reply-comment",methods=['POST'])
@jwt_required()
def reply_comment():
    user_id=get_jwt_identity()
    data=request.get_json()

    #user=db.users.find_one({"_id":ObjectId(post['user_id'])})
    user=list(
        db.comments.aggregate([
        {'$match':{'_id':ObjectId(user_id)}},
        {'$lookup':{
            'from':'restricted',
        'let': {
                    'user_1': '$user_1',
                    'user_2': '$user_2',

                },
                'pipeline': [

                    {
                        '$project': {
                            'user_1': {'$cond': [{'$and':[{'$eq': ['$user_1','user_id']},{'$eq': ['$user_2', ObjectId(user_id)]}]}, 1, 0]},

                        }
                    }, 
                ],
            'as':'restricted'
        }},
              {'$lookup':{
            'from':'blocked',
            'let': {
                    'user_1': '$user_1',
                    'user_2': '$user_2',

                },
                'pipeline': [

                    {
                        '$project': {
                            'user_1': {'$cond': [{'$and':[{'$eq': ['$user_1','user_id']},{'$eq': ['$user_2', ObjectId(user_id)]}]}, 1, 0]},

                        }
                    }, 
                ],
            'as':'blocked'
        }}
    ])
    )

    if len(user)==0:
        user={
            'blocked':0,
            'restricted':0
        }
    else:
        user=user[0]
    if  user['restricted'] or user['blocked']:
        return {'message':'You cannot comment on this post'},200
    crypt,nonce,tag=encrypt_text(data['comment'],user_id)
    data={
        "user_id":ObjectId(user_id),
        "likes":{

        },
        "comment":crypt,
        "timestamp":datetime.now(),
        'nonce':nonce,
        'tag':tag,
        
    }
    db.comments.update_one({'_id':ObjectId(data['id'])},{'$push':{'replies':data}})

    return {},200    
@app.route("/v1/get-comments")
@jwt_required()
def get_comments():
    data=request.args.get("id")  
    user_id=get_jwt_identity()
    post=list(db.comments.aggregate([
        {'$match':{"content_id":ObjectId(data)}},
        {
            '$lookup':{
                'from':'users',
                'localField':'user_id',
                'foreignField':'_id',
                'as':'users',
            }
        },
        {'$unwind':'$users'},
        {'$project':{
            'comment':1,
            'user_id':1,
            'nonce':1,
            'tag':1,
            'likes':1,
            'timestamp':1,
            'users.username':1,
            'users.profile_picture':1,
            'replies':1
        }}
    ]))
    print(list(post))
    if not post:
        return {},422


    data=[{'id':str(row['_id']),'comment':decrypt_text(row['comment'],str(row['user_id']),row['nonce']),'likes':len(row['likes']),'liked': False if user_id not in row['likes'].keys() else True,'time':getTimedifference(row['timestamp']),'username':row['users']['username'],'replies':len(row['replies'])} for row in post] 

    print(data)
    return jsonify(data),200


@app.route("/v1/like-comment",methods=['POST'])
@jwt_required()
def like_comment():
    data=request.get_json()
    user_id=get_jwt_identity()
    id=data['id']
    print(data)
    post=db.comments.find_one({"_id":ObjectId(id)})
    if user_id in post['likes'].keys():
        post['likes'].pop(user_id)
    else:
        post['likes'][user_id]=datetime.now()

    db.comments.update_one({'_id':ObjectId(id)},{'$set':{"likes":post['likes']}})
    return {},200


@app.route("/v1/get-nft-settings")
@jwt_required()
def get_nft_settings():
    user_id=get_jwt_identity()

    id=request.args.get('id')
    print(id)
    content=db.content.find_one({'_id':ObjectId(id)})
    print(content)
    if not content:
        return {},400

    content={'bid':content['bid'],'price':content['price'],'owners':content['owners']}
    data=[]
    bids=db.bids.find({"content_id":ObjectId(id)},{'id':{'$toString':'$_id'},"_id":0,'address':1,'price':1,'content_id':{'$toString':'$content_id'},'status':1})

    content['bids']=list(bids)
    
    return jsonify(content),200
    
@app.route("/v1/save-nft-settings",methods=['POST'])
@jwt_required()
def save_nft_settings():
    user_id=get_jwt_identity()
    
    data=request.get_json()
    id=data['id']
    print(data)
    db.content.update_one({"_id":ObjectId(id)},{"$set":{
        'bid':data['bid'],
        'price':int(data['price']),

    }})

    return jsonify(data),200


@app.route("/v1/bid-action",methods=['POST'])
@jwt_required()
def bid_action():
    user_id=get_jwt_identity()
    data=request.get_json()
    user=db.users.find_one({'address':data['address']})
    id=data['id']
    mode= data['mode']
    if mode==1:
        db.bids.update_one({"_id":ObjectId(id)},{"$set":{'status':mode,'payment':False}})
        activity(ObjectId(user_id),user['_i1'],5,ObjectId(data['id']))
        db.transactions.insert({'content_id':data['content_id'],'from':data['address__1'],'to':data['address_2'],'status':0,'bid_id':ObjectId(data['id']),'created_at':datetime.now()})      
    else:
        db.bids.update_one({"_id":ObjectId(id)},{"$set":{'status':mode}})

    return {},200

@app.route("/v1/bid",methods=['POST'])
@jwt_required()
def bid_post():
    user_id=get_jwt_identity()  
    data=request.get_json()

    user=db.users.find_one({"_id":ObjectId(user_id)})
    if len(user['address'])==0:
        return {},400
    content=db.content.find_one({"_id":ObjectId(data['id'])})
    bids=list(db.bids.find({"content_id":data['id']}).sort("_id",-1).limit(1))
    last_bid=0
    if last_bid:
        last_bid=bids[0]['price']

    if float(data['price'])<last_bid:
        return {'message':'Amount should be greater then '+str(last_bid)},400

    db.bids.insert_one({"content_id":ObjectId(data['id']),'user_id':ObjectId(user_id),'price':float(data['price']),'address':user['address'],'user_2':content['user_id'],'status':0,'datetime':datetime.now()})
    activity(ObjectId(user_id),content['user_id'],3,ObjectId(data['id']))
    return {},200

@app.route('/v1/bid/payment',methods=['POST'])
@jwt_required()
def bid_payment():
    data=request.get_json()
    print(data)
    db.transactions.update_one({'bid_id':ObjectId(data['id']),},{'$set':{'status':1,'transfer':data['transfer']}})
    return {},200


@app.route("/v1/nft/transfer",methods=['POST'])
@jwt_required()
def nft_transfer():
    user_id=get_jwt_identity()
    data=request.get_json()
    user=db.users.find_one({'address':data['address']})
    content=db.content.find_one({'_id':ObjectId(data['id'])})
    if content:
        db.activity.delete_many({'content_id':content['_id']})
        db.comments.delete_many({'content_id':content['_id']})

        content['user_id']=user['_id']
        content['owners'].append(ObjectId(user_id))
        db.content.update_one({'_id':content['_id'],},{'$set':{'owners':content['owners'],'user_id':user['_id']}})

    return {},200


     



@app.route("/v1/nft/new",methods=['POST'])
@jwt_required()
def nft_owner():
    user_id=get_jwt_identity()
    data=request.get_json()
    print(data,user_id)
    tokens=db.content.aggregate([
        {'$match':{'tokenId':{'$in':data['tokens']}}},
        {'$lookup':{
            'from':'users',
            'foreignField':'_id',
            'localField':'user_id',
            'as':'users'
        }},
        {'$unwind':'$users'},
        {'$project':{
            'address':1,
            'tokenId':1,
            'user_id':1,

        }}
    ])
    url=f'https://deep-index.moralis.io/api/v2/{address}/nft?chain=rinkeby&format=decimal'
    res=requests.get(url,headers=headers).json()['result']
    address_tokens=[i['token_id'] for i in res]
    result=[]
    for id,token,address,user in tokens:
        if token in address_tokens and user_id!=user:
            result.append(address,token,address_tokens)
    if len(result)>0:
        db.content.update_many({'tokenId':{'$in':result}},{'$set':{'user_id':ObjectId(user_id)}})
    return {},200
