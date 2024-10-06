from datetime import datetime

from bson import ObjectId
from mongoengine import DateTimeField, EmbeddedDocument, IntField, LazyReferenceField, ListField, ObjectIdField, StringField


class Comment(EmbeddedDocument):
    _id = ObjectIdField(default=ObjectId, required=True, primary_key=True)
    user = LazyReferenceField('User', required=True)
    to_comment = LazyReferenceField('Comment', required=False)
    content = StringField(required=True)
    like_count = IntField(default=0)
    created_at = DateTimeField(default=datetime.now())

