from app import db

class Employee(db.Model):

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    email = db.Column(db.String(100))


class ESOPGrant(db.Model):

    id = db.Column(db.Integer, primary_key=True)
    employee_id = db.Column(db.Integer)
    shares = db.Column(db.Integer)
    transaction_hash = db.Column(db.String(200))