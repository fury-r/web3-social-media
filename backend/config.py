import os
from webapp import app
import datetime
from dotenv import load_dotenv

load_dotenv()
app.config['SECRET_KEY']= os.getenv('SECRET_KEY')
app.config['MONGO_URI']=os.getenv('MONGO_URI')
app.config['JWT_ACCESSS_TOKEN_EXPIRES']=datetime.timedelta(days=300)
app.config['JWT_BLACKLIST_ENABLED'] = True
app.config['JWT_BLACKLIST_TOKEN_CHECKS'] = ['access', 'refresh']
app.config['JWT_COOKOE_SECURE']=False
app.config['UPLOAD_EXTENSIONS'] = ['jpg', 'png', 'gif','jpeg']
app.config['UPLOAD_FOLDER'] =os.path.join(os.path.dirname(app.instance_path), 'static')

app.config['JWT_TOKEN_LOCATION']=['headers']
app.config['JWT_SESSION_COOKIE']=False
app.config['MONGODB_SETTINGS']={
    'db': os.getenv('DB_NAME'),
    'host':'localhost',
    'port':'27017'
}
