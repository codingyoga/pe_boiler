from flask import Blueprint, render_template, abort, request, redirect, url_for, session
from jinja2 import TemplateNotFound
from forms import LoginForm
from werkzeug.utils import secure_filename


dashboard = Blueprint('dashboard', __name__,
                        template_folder='templates/dashboard')

# from util.auth import token_required,app,jwt
from parenteye import application, token_required, cwd



# @dashboard.before_request
# def before_request():
#     print('request')


# @dashboard.route('/', defaults={'page': 'index'})
# @token_required
# def main(user, page):
#     print(user)
#     return render_template('index.html')


@dashboard.route('/')
@token_required
def fee(user):
    return render_template('dashboard/fee.html')


# @dashboard.route('/transportation')
# @token_required
# def transportation(user):
#     return render_template('dashboard/transportation.html')



@dashboard.route('/remote_logout')
def remote_logout():
    session.clear()
    return redirect(application.config.get('OLD_LOGOUT_URL')), 302



def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ('csv')


from tasks.uploadStudentStages import upload_student_stage
@dashboard.route('/upload_file', methods=['GET', 'POST'])
@token_required
def upload_file(user):
    if request.method == 'POST':
        success = None
        if 'csv_file' not in request.files:
            return render_template('dashboard/upload_file.html',
                                   error='No file part')
        csv_file = request.files['csv_file']
        if csv_file.filename == '':
            return render_template('dashboard/upload_file.html',
                                   error='No selected file')
        if not allowed_file(csv_file.filename):
            return render_template('dashboard/upload_file.html',
                                   error='Selected file type not support')
        if csv_file and allowed_file(csv_file.filename):
            email = request.form.get('email')
            filename = secure_filename(csv_file.filename)
            file_location = cwd+'/' + \
                application.config.get('UPLOAD_FOLDER') + '/'
            csv_file.save(file_location + filename)
            upload_student_stage(filename, user['school_id'],email)
        return render_template('dashboard/upload_file.html',
                                success=success)
    else:
        return render_template('dashboard/upload_file.html')

from parenteye import db
from red.master import *
@dashboard.route('/test')
@token_required
def test(user):
    results = db.session.query(SchoolClass, Student).join(
        SchoolClass, SchoolClass.id == Student.school_class_id).filter(
        SchoolClass.school_id == user['school_id'], SchoolClass.status == 'Active',
        Student.status == 'Active').group_by(Student.id).all()
    print(results)
    return 'test'
