from datetime import datetime

from flask_bcrypt import generate_password_hash, check_password_hash
from mongoengine import Document, StringField, EmailField, DateField, DateTimeField


class User(Document):
    email = EmailField(required=True, unique=True)
    name = StringField(required=True)
    password = StringField(default=None)
    role = StringField(default='user')
    date_of_birth = DateField(required=None)

    # Add fields for tracking creation and deletion timestamps
    created_at = DateTimeField(default=datetime.utcnow)  # Set automatically when the document is created
    deleted_at = DateTimeField(default=None)  # Set to None initially (soft delete field)

    meta = {'collection': 'users'}

    @classmethod
    def get_by_email(cls, email):
        return cls.objects(email=email).first()

    def create(self):
        if self.password is not None:
            self.password = generate_password_hash(self.password).decode('utf-8')
        return self.save()

    def check_password(self, password):
        return check_password_hash(self.password, password)

    def soft_delete(self):
        self.deleted_at = datetime.utcnow()  # Set the deleted_at timestamp
        self.save()

    def to_json(self):
        return {
            "id": str(self.id),
            "email": self.email,
            "name": self.name,
            "role": self.role,
            "created_at": self.created_at.strftime('%Y-%m-%d %H:%M:%S') if self.created_at else None,
            # Exclude fields like 'password' and 'deleted_at' for security reasons
        }
