# import datetime
from datetime import datetime
import time
from random import randint
from red.master import *
from parenteye import db, token_required, app_log
from flask.views import MethodView
from util.enums import GenEnum, NewEnum, UserType
from util.msgEnums import MsgEnum
from util.other import trcbck
from flask import jsonify ,json, request
from forms import SchemaValidate
from jsonschema import validate, Draft7Validator
from sqlalchemy.sql import func, and_, or_
from sqlalchemy.orm import aliased
from util.academic import find_academic_year

# from util.auth import *
# from sqlalchemy.orm import joinedload



def successRes(msg=None, key=None, value=None):
    out = {"status": 'success',
           "message": msg if msg else 'Success Msg'}
    if key and value:
        out.update({"data": {
            key: value
        }
        })
    return jsonify(out)

def failureRes(msg=None, errors=None):
    out = {
            "status": 'failure',
            "message": msg if msg else 'Failure Msg'
        }
    if errors:
        out.update({'errors' : errors})
    return jsonify(out)

def isValidationError(dataInstance, schema):
    schemaValidate = Draft7Validator(schema)
    validationErrors = []
    for error in sorted(schemaValidate.iter_errors(dataInstance), key=str):
        validationErrors.append(error.message)
    print(validationErrors)

    if not validationErrors:
        return False
    return validationErrors



def convDate(date_time_str):
    try:
       # print(date_time_str)
        if date_time_str is not None:
            date_time_obj = datetime.strptime(date_time_str, '%Y-%m-%d')
            return date_time_obj.date()
        else:
            return date_time_str
    except TypeError:
        return date_time_str.strftime('%Y-%m-%d')

    # print('Date:', date_time_obj.date())
    # print('Time:', date_time_obj.time())
    # print('Date-time:', date_time_obj)

