from wtforms import StringField, SubmitField, validators, DateField
from wtforms.validators import Email, ValidationError, DataRequired, Length
from datetime import datetime
from flask_wtf import FlaskForm
from webapp import db
import re
import socket
from bson.objectid import ObjectId

def unique_username(form,field):
    print(field.data,form.data)
    get_data=db.users.find_one({'username':field.data})

    user_id=''
    if 'user_id' in form.data.keys() and get_data:
        user_id=form.data['user_id']
    else:
        user_id=''



    if get_data  and str(get_data['_id'])!=user_id:
        raise ValidationError('Username Already Exists.')

def unique_email(form,field):
    print(field.data,db.users)
    get_data=db.users.find_one({'email':field.data})
    print(get_data,'email')
    if get_data:
        raise ValidationError('Email Alraedy Exists.')
def unique_phno(form,field):
    get_data=db.users.find_one({'phone_number':field.data})
    print(get_data)
    if get_data:
        raise ValidationError('Phone Number already Exists.')
def password_check(form,field):
    error=[] 
    password=field.data
    # if len(password)<8:
    #     error.append('Password should have more then 8 characters.')
    pattern='[A-Z]'
    if re.search(pattern, password)==None:
        error.append('Password Should Contain an uppercase character.')

    regex = re.compile('[@_!#$%^&*()<>?/\|}{~:]')
    if regex.search(password)==None:
        error.append('Password Should Contain a special character.')
    print(error)
    if len(error)>0:
        raise ValidationError(error)

def specialcharaterCheck(form,field):
    regex = re.compile('[a-zA-Z]+')
    data=field.data
    print(data)
    if regex.search(data)==None:
        raise ValidationError('Should Not Contain  special characters and Numbers.')
def validate_dob(form,field):
    dob=str(field.data)
    dob_divide=list(map(int,dob.split('-')))
    year=int(datetime.now().year)
    month=int(datetime.now().month)
    day=int(datetime.now().day)
    if (year-dob_divide[0]<18  or  (year-dob_divide[0]==18 and month<dob_divide[1] ) or  (year-dob_divide[0]==18 and month==dob_divide[1] and day<dob_divide[2] )):
        raise ValidationError('User Should be 18 and  Above ')

def validate_desc(form,field):
    if len(field.data)==0:
        raise ValidationError("Description cannot be empty")

class UserForm(FlaskForm):
    email=StringField(label=('email'),validators=[DataRequired(),unique_email])
   # phone_number=StringField(label=('phone_number'),validators=[DataRequired(),Length(max=10,min=10),unique_phno])
    password=StringField(label=('password'),validators=[DataRequired(),Length(min=8),   password_check])
    #dob=StringField(label=('dob'),validators=[DataRequired(),validate_dob])

    name=StringField(label=('name'),validators=[DataRequired(),specialcharaterCheck])
    username=StringField(label=('username'),validators=[DataRequired(),unique_username])
# Email(check_deliverability=True),


    

class LoginForm(FlaskForm):
    email=StringField(label=('email'),validators=[DataRequired()])
    password=StringField(label=('password'),validators=[DataRequired(),Length(min=8)])

class EditProfile(FlaskForm):
    desc=StringField(label=('desc'),validators=[DataRequired()])
    username=StringField(label=('username'),validators=[DataRequired(),unique_username])
    user_id=StringField(label=('user_id'),validators=[DataRequired(),unique_username])
