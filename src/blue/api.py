# from red.master import Product, Category
from flask import Blueprint


import jwt
import datetime
# from functools import wraps
from flask import jsonify, request
from flask.views import MethodView


mobApi = Blueprint('mobApi', __name__,
                        template_folder='templates')

# from util.auth import token_required,app,jwt
from parenteye import application, token_required


@mobApi.route('/', defaults={'page': 'index'})
@token_required
def show(user,page):
    return "404"




@mobApi.route('/hello')
def main():
    from red.master import FeeType
    # from red.marshmodel import FeeTypeSchema
    # query = FeeType.query.first()
    # fee_schema = FeeTypeSchema()
    # query = FeeType.query.all()
    # fee_schema = FeeTypeSchema(many=True)
    # output = fee_schema.dump(query).data
    # return jsonify({'ff': output})

@mobApi.route('/generateToken')
def genereteToken():
    token = jwt.encode({'user_id': 123, 'user_role_id': 456, 'exp': datetime.datetime.utcnow(
    ) + datetime.timedelta(minutes=30)}, application.config['SECRET_KEY'])
    return jsonify({'token':token.decode('UTF-8')})



from green import *


def register_api(view, endpoint, url, pk='id', pk_type='int'):
    view_func = view.as_view(endpoint)
    mobApi.add_url_rule(url, defaults={pk: None},
                        view_func=view_func, methods=['GET', 'DELETE', 'PATCH'])
    mobApi.add_url_rule(url, view_func=view_func,
                        methods=['POST', 'OPTIONS'])
    mobApi.add_url_rule('%s<%s:%s>' % (url, pk_type, pk), view_func=view_func,
                     methods=['GET', 'PATCH', 'DELETE'])



register_api(FeeTypeServ, 'fee_category_api', '/fee_type/', pk='fee_type_id')

