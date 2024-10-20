import os

from dotenv import load_dotenv

load_dotenv()

# load_dotenv('D:\PBL6\.env')
class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY')

    MONGODB_SETTINGS = {
        'db': 'PBL6',
        'host': 'localhost',
        'port': 27017,
        'uuidRepresentation': 'standard'
    }

    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY')
    JWT_TOKEN_LOCATION = ['cookies']
    JWT_COOKIE_SECURE = False
    JWT_COOKIE_CSRF_PROTECT = True

    CLOUDINARY_CLOUD_NAME = os.getenv('CLOUDINARY_CLOUD_NAME')
    CLOUDINARY_API_KEY = os.getenv('CLOUDINARY_API_KEY')
    CLOUDINARY_API_SECRET = os.getenv('CLOUDINARY_API_SECRET')