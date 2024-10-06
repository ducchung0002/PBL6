from datetime import datetime

from mongoengine import DateTimeField, Document, StringField


class Genre(Document):
    name = StringField(required=True)
    description = StringField()
    created_at = DateTimeField(default=datetime.now())
    updated_at = DateTimeField(default=datetime.now())
    deleted_at = DateTimeField()

    meta = {'collection': 'genres'}

    def jsonify(self, *args, **kwargs):
        return {
            'id': str(self.id),
            'name': self.name,
            'description': self.description,
            'created_at': self.created_at,
            'updated_at': self.updated_at,
            'deleted_at': self.deleted_at
        }