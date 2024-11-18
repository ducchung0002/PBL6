import os

# Set the environment variable
os.environ["DEFAULT_AVATAR_URL"] = "https://res.cloudinary.com/dddiwftri/image/upload/v1731338036/default_avatar_crdcce.svg"

from dotenv import load_dotenv

load_dotenv()


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
