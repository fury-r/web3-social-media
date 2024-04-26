
import datetime
from webapp import  db
from smtp import send_message, smtp
from bson import ObjectId

while True:
    data=db.bids.find({'payment':True})
    for row in data:
        user=db.users.find({'_id':data['user_id']})
        db.transactions.insert({'content_id':row['content'],'from':data['user_id'],'to':['user_2'],'status':0,'bid_id':row['_id'],'created_at':datetime.now()})      
    