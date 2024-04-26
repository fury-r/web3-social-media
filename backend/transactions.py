
from webapp import  db
from smtp import send_message, smtp
from bson import ObjectId
import datetime

#0-pending
#1-payment done
#2-asset transferred
while True:
    data=db.transactions.find({'status':1})
    for row in data:
        #db.content.update_one({'_id':ObjectId(row['content_id'])},{'$set':{'user_id':row['user_id']}})    
        db.transactions.update_one({'_id':row['_id']},{'$set':{'status':2}})
        db.bids.update_one({'_id':row['bid_id']},{'$set':{'status':2}})