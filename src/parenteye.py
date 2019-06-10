#!/usr/local/bin/python3
from flask import Flask, render_template, jsonify, request, json, session, redirect, url_for
from flask_mail import Mail, Message
from flask_babel import Babel
import logging
from logging import FileHandler, Formatter
from logging.handlers import SMTPHandler, RotatingFileHandler
import os
from util.other import MyJSONEncoder, trcbck

application = Flask(__name__)

application.config.from_pyfile('config.cfg')

application.json_encoder = MyJSONEncoder

# database init
from red.master import db
db.init_app(application)

# marshmallow init
# from red.marshmodel import ma
# ma.init_app(app)

babel = Babel(application)

@babel.localeselector
def get_locale():
    return request.accept_languages.best_match(application.config.get('LANGUAGES').keys())

mail = Mail(application)

# Error logger
cwd = os.getcwd()
log_format = Formatter(
                        '%(asctime)s %(levelname)s: %(message)s '
                        '[in %(pathname)s:%(lineno)d]'
                    )
file_location = cwd + '/' + application.config['LOG_FILE']
while application.logger.handlers:
         application.logger.handlers.pop()
if not application.debug:
    rotating_handler = RotatingFileHandler(file_location, mode='a', maxBytes=5*1024*1024,
                                            backupCount=2, encoding=None, delay=0)
    rotating_handler.setLevel(logging.INFO)
    application.logger.addHandler(rotating_handler)
    mail_handler = SMTPHandler(
        (application.config['MAIL_SERVER'], 587), application.config['MAIL_DEFAULT_SENDER'],application.config['ADMIN_EMAILS'],
        'Error in application new',
        (application.config['MAIL_USERNAME'], application.config['MAIL_PASSWORD']), secure=()
    )
    mail_handler.setLevel(logging.WARNING)
    application.logger.addHandler(mail_handler)
    for handler in [rotating_handler, mail_handler]:
        handler.setFormatter(log_format)
else:
    file_handler = FileHandler(file_location)
    file_handler.setLevel(logging.WARNING)
    file_handler.setFormatter(log_format)
    application.logger.addHandler(file_handler)


def app_log(e,level  = None):
    if not level:
        application.logger.error(trcbck(e))
    elif level == 1:
        application.logger.critial(trcbck(e))
    else:
        application.logger.warning(trcbck(e))
    if application.debug:
        print(trcbck(e))

from functools import wraps
import jwt


# Decorated
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        if application.debug:
            user = {
                "user_id": 27947,
                "user_role_id": 28467,
                "user_type": "Principal",
                "school_id": 135,
                "name": "Test user",
                "school_name": "Scientia Test School"
            }
            return f(user, *args, **kwargs)
    
        current_user    = None
        current_role    = None
        user_type       = None
        school_id       = None
        name            = None
        school_name     = None

        print(request.user_agent.platform)
        if 'x-access-token' in request.headers:
            token = request.headers['x-access-token']
            try:
                data = jwt.decode(token, application.config['SECRET_KEY'])
                current_user    = data['user_id']
                current_role    = data['user_role_id']
                user_type       = data['user_type']
                school_id       = data['school_id']
                name            = data['name']
                school_name     = data['school_name']
                # To Return user object create query down here
                # current_user = User.query.filter_by(public_id=data['public_id']).first()
            except Exception as e:
                print(e)
                return jsonify({'message': 'Token is invalid'}), 403
        elif 'user_id' in session.keys() and 'user_role_id' in session.keys():
            current_user    = session['user_id']
            current_role    = session['user_role_id']
            user_type       = session['user_type']
            school_id       = session['school_id']
            name            = session['name']
            school_name     = session['school_name']

        if (not current_user) or (not current_role):
        # if all([current_user, current_role, user_type, school_id]):
            if request.user_agent.platform in ('android','iphone'):
                return jsonify({'message': 'Token is missing'}), 401
            else:
                return redirect(application.config.get('OLD_APP_URL')), 401
                # return redirect(url_for('main')), 401
        user = {
            "user_id": current_user,
            "user_role_id": current_role,
            "user_type": user_type,
            "school_id": school_id,
            "name": name,
            "school_name": school_name
            }
        return f(user, *args, **kwargs)
    return decorated

from blue.dashboard import dashboard
from blue.partialload import partialload
from blue.api import mobApi

application.register_blueprint(dashboard, url_prefix='/dashboard')
application.register_blueprint(partialload, url_prefix='/partialload')
application.register_blueprint(mobApi, url_prefix='/api')


# db = SQLAlchemy(application)

# from views import *


@application.route('/')
@token_required
def main(user):
    return redirect(url_for('dashboard.main'))


from forms import LoginForm

@application.route('/login', methods=['GET','POST'])
def login():
    form = LoginForm()
    if form.validate_on_submit():
        pass
        # return redirect('/success')
        # session['user_id'] = 888
        # session['user_role_id'] = 999
        # return redirect(url_for('dashboard.main')), 302
    # user1 = User.query.all()
    # print(user1)
    return render_template('login.html',form=form)


@application.route('/logout')
def web_logout():
    session.clear()
    return redirect(url_for('dashboard.main'))



if __name__ == '__main__':
    application.run(host='0.0.0.0')
