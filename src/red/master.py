from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


def create_app():
    from flask import Flask
    app = Flask(__name__)
    app.config.from_pyfile('../config.cfg')
    db.init_app(app)
    return app

class FeeType(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True, nullable=False)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(200), nullable=True)
    # school_id = db.Column(db.Integer, db.ForeignKey(
    #     'school.id'), nullable=True)
    status = db.Column(db.String(2), nullable=False, default='A')

    # school = db.relationship(
    #     'School', backref=db.backref('fee_types', lazy='dynamic'))


