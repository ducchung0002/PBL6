from datetime import datetime

from mongoengine import DateTimeField, Document, StringField


class Genre(Document):
    name = StringField(required=True)
    description = StringField()
    created_at = DateTimeField(default=datetime.now())
    updated_at = DateTimeField(default=datetime.now())
    deleted_at = DateTimeField()

    meta = {'collection': 'genres'}
