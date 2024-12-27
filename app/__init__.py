from flask import Flask
from mongoengine import connect, disconnect
from app.config import Config
from flask_cors import CORS
import cloudinary


def create_app():
    app = Flask(__name__, static_folder='static', static_url_path='/static')
    app.config.from_object(Config)

    disconnect()
    connect(**app.config['MONGODB_SETTINGS'])
    # Initialize JWTManager
    # jwt = JWTManager(app)

    cors_config = {
        "origins": ["http://localhost:5000", "http://127.0.0.1:5000"],
        "methods": ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"],
        "expose_headers": ["X-Total-Count", "X-Page", "X-Per-Page"],
        "credentials": True
    }
    CORS(app, resources={r"/api/*": cors_config})

    from app.routes.auth import auth_bp
    from app.routes.user import user_bp
    from app.routes.admin import admin_bp
    from app.routes.artist import artist_bp
    from app.routes.music import music_bp
    from app.routes import home_bp
    from app.routes.npm_modules import npm_modules_bp

    app.register_blueprint(home_bp, url_prefix='/')
    app.register_blueprint(npm_modules_bp, url_prefix='/node_modules')
    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(user_bp, url_prefix='/user')
    app.register_blueprint(admin_bp, url_prefix='/admin')
    app.register_blueprint(artist_bp, url_prefix='/artist')
    app.register_blueprint(music_bp, url_prefix='/music')

    # Initialize Blueprint for API routes
    from app.routes.api import api_bp
    app.register_blueprint(api_bp, url_prefix='/api')

    cloudinary.config(
        cloud_name=app.config.get('CLOUDINARY_CLOUD_NAME'),
        api_key=app.config.get('CLOUDINARY_API_KEY'),
        api_secret=app.config.get('CLOUDINARY_API_SECRET')
    )

    return app
