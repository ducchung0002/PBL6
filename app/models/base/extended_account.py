from mongoengine import DateField, EmailField, EmbeddedDocumentField, FloatField, IntField, LazyReferenceField, \
    ListField, StringField, ObjectIdField

from app.models.base.account import Account
from app.models.query_set.extended_account_query_set import ExtendedAccountQuerySet


class ExtendedAccount(Account):
    email = EmailField(required=True, unique=True)
    followers_count = IntField(default=0)
    following_count = IntField(default=0)
    date_of_birth = DateField()
    bio = StringField(max_length=255)
    notifications = ListField(EmbeddedDocumentField('Notification'))
    like_videos = ListField(LazyReferenceField('Video'), default=list)
    like_comments = ListField(ObjectIdField(), default=list)


    meta = {
        'allow_inheritance': True,
        'queryset_class': ExtendedAccountQuerySet
    }

    @classmethod
    def get_by_email(cls, email):
        return cls.objects(email=email).first()

    def jsonify(self):
        return super().jsonify() | {
            "email": self.email,
            "followers_count": self.followers_count,
            "following_count": self.following_count,
            "date_of_birth": self.date_of_birth.strftime('%Y-%m-%d') if self.date_of_birth else None,
        }
