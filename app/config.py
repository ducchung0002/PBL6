import os

from dotenv import load_dotenv

load_dotenv()


class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY')

    dtb_mode = os.environ.get('DTB_MODE', 'local')

    if dtb_mode == 'local':
        # Local mongodb
        MONGODB_SETTINGS = {
            'db': 'PBL6',
            'host': 'localhost',
            'port': 27017,
            'uuidRepresentation': 'standard'
        }
    else:
        # Remote mongodb
        MONGODB_SETTINGS = {
            'db': 'karaoke',
            'host': os.getenv('MONGO_DB_HOST')
        }

    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY')
    JWT_TOKEN_LOCATION = ['cookies']
    JWT_COOKIE_SECURE = False
    JWT_COOKIE_CSRF_PROTECT = True

    CLOUDINARY_CLOUD_NAME = os.getenv('CLOUDINARY_CLOUD_NAME')
    CLOUDINARY_API_KEY = os.getenv('CLOUDINARY_API_KEY')
    CLOUDINARY_API_SECRET = os.getenv('CLOUDINARY_API_SECRET')

    CELERY_BROKER_URL = os.getenv('CELERY_BROKER_URL', 'redis://localhost:6379/0')
    CELERY_RESULT_BACKEND = os.getenv('CELERY_RESULT_BACKEND', 'redis://localhost:6379/0')