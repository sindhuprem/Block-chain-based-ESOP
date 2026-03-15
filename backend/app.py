from flask import Flask
from flask_cors import CORS
from extensions import db

def create_app():
    app = Flask(__name__)

    # Database
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///esop.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    # Allow requests from React frontend (port 3000)
    CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})

    db.init_app(app)

    from routes import main
    app.register_blueprint(main)

    return app


app = create_app()

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True)