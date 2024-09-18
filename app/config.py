import os

from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY')
    # MONGODB_SETTINGS = {
    #     'db': 'PBL6',
    #     'host': os.environ.get('MONGO_HOST', 'mongodb'),
    #     'port': int(os.environ.get('MONGO_PORT', 27017))
    # }

    MONGODB_SETTINGS = {
        'db': 'PBL6',
        'host': 'localhost',
        'port': 27017
    }

    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY')
    JWT_TOKEN_LOCATION = ['cookies']
    JWT_COOKIE_SECURE = False
    JWT_COOKIE_CSRF_PROTECT = True