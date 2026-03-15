from extensions import db
from datetime import datetime

class Employee(db.Model):
    __tablename__ = "employees"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    role = db.Column(db.String(50), default="employee")   # employee | hr | admin
    department = db.Column(db.String(100))
    wallet_address = db.Column(db.String(42))             # Ethereum address only
    status = db.Column(db.String(20), default="active")   # active | pending
    password_hash = db.Column(db.String(256))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "role": self.role,
            "department": self.department,
            "wallet_address": self.wallet_address,
            "status": self.status,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }