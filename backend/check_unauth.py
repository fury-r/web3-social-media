
from webapp import  db
from smtp import send_message, smtp
from bson import ObjectId
while True:
    data=db.users.find({"attempts":{'$gt':2}})
    for i in data:
        print('Detected')
        msg="<h3>Dear user,Someone try to access your account with invalid password please head on to <a href='http://localhost:300'>Leylines</a>! and change the password</h3><br /><hr>If its you who was trying to access the account then ignore this email</hr><br/> <h3>Regards,<br />Leylines</h3>"
        #smtp(msg,i['email'])
        send_message(i['email'],'unauthorized access',msg)
        db.users.update_one({"_id":ObjectId(i['_id'])},{"$set":{'attempts':0}})