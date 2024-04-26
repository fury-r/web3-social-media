import smtplib
import os
import base64
import base64
from email.message import EmailMessage
from mailjet_rest import Client

import google.auth
from googleapiclient.discovery import build




def smtp(msg,recv):
    user_email='mail'
    password='password'
    s=smtplib.SMTP('in-v3.mailjet.com',587)

    s.starttls()
    
    s.login(user_email,password)
    
    message=msg
    s.sendmail(user_email,recv,message)
    print("message sent to",recv)
    s.quit() 
def send_message(to,sub,body):
    api_key = os.get("api_key")
    api_secret = os.get("api_secret")
    mailjet = Client(auth=(api_key, api_secret), version='v3.1')
    data = {
    'Messages': [
        {
        "From": {
            "Email": "x",
            "Name": "Leylines"
        },
        "To": [
            {
            "Email": to,
            }
        ],
        "Subject": sub,
        "HTMLPart": '''<div style="box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);  transition: 0.3s;padding: 2px 16px;">'''+body+'''</div>''',
        "CustomID": "AppGettingStartedTest"
        }
    ]
    }
    result = mailjet.send.create(data=data)
    print( result.status_code)
    print( result.json())
    print("Mailed to ",to  )





# os.environ["GOOGLE_APPLICATION_CREDENTIALS"]
def send_email(to,sub,body):
    creds,_=google.auth.default()


    try:
        service=build('gmail','v1',credentials=creds)
        message=EmailMessage()
        message.set_content(body)
        message['to']=to
        message['from']='email'
        message['subject']=sub

        encoded_message=base64.urlsafe_b64encode(message.as_bytes().decode())
        create_message={
            'raw':encoded_message
        }
        send_message=service.users().messages().send(userId='me',body=create_message).execute()

        print(f'Message Id: {send_message["id"]}')
    except Exception as e:
        print(e)
