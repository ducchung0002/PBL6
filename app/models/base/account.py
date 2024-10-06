from mongoengine import BooleanField, DateTimeField, Document, StringField, BinaryField, URLField
from datetime import datetime
from app.models.enum.account_role import AccountRole
from flask_bcrypt import check_password_hash, generate_password_hash


class Account(Document):
    username = StringField(required=True, unique=True, max_length=50)
    name = StringField(required=True)
    password = BinaryField()
    role = StringField(default=AccountRole.USER.value, choices=[role.value for role in AccountRole])
    avatar_url = URLField()
    gender = BooleanField()

    created_at = DateTimeField(default=datetime.now())
    updated_at = DateTimeField(default=datetime.now())
    deleted_at = DateTimeField()

    meta = {'allow_inheritance': True, 'collection': 'accounts'}


    def check_password(self, password):
        if self.password is None:
            return None
        return check_password_hash(self.password, password)

    def soft_delete(self):
        self.deleted_at = datetime.now()  # Set the deleted_at timestamp
        self.update(set__deleted_at=self.deleted_at)

    def set_password(self, password):
        self.password = generate_password_hash(password)
        return self
