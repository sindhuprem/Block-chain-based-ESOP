from flask import Blueprint, jsonify
from models import Employee

main = Blueprint("main", __name__)

@main.route("/")
def home():
    return "Backend Running Successfully!"

@main.route("/employees")
def get_employees():
    employees = Employee.query.all()
    return jsonify([
        {
            "id": emp.id,
            "name": emp.name,
            "email": emp.email,
            "shares": emp.shares
        }
        for emp in employees
    ])