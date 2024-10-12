from mongoengine import DateField, EmailField, EmbeddedDocumentField, FloatField, IntField, ListField, StringField

from ..base.account import Account
from ..embedded_document.notification import Notification


class ExtendedAccount(Account):
    email = EmailField(required=True, unique=True)
    followers_count = IntField(default=0)
    following_count = IntField(default=0)
    date_of_birth = DateField(required=True)
    bio = StringField(max_length=255)
    user_vector = ListField(FloatField())
    notifications = ListField(EmbeddedDocumentField(Notification))
    like_videos = ListField(EmbeddedDocumentField('Video'))
    like_comments = ListField(EmbeddedDocumentField('Comment'))

    meta = {'allow_inheritance': True}

    @classmethod
    def get_by_email(cls, email):
        return cls.objects(email=email).first()

    def to_json(self):
        return {
            "id": str(self.id),
            "email": self.email,
            "name": self.name,
            "role": self.role,
            "avatar_url": self.avatar_url,
            "bio": self.bio,
            "followers_count": self.followers_count,
            "following_count": self.following_count,
            "date_of_birth": self.date_of_birth.strftime('%Y-%m-%d') if self.date_of_birth else None,
            "created_at": self.created_at.strftime('%Y-%m-%d %H:%M:%S') if self.created_at else None,
        }
