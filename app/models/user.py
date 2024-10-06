from mongoengine import LazyReferenceField, ListField

from .base.extended_account import ExtendedAccount
from .genre import Genre


class User(ExtendedAccount):
    favourite_genres = ListField(LazyReferenceField(Genre))  # Embedded list field for favourite genres

    def jsonify(self):
        return {
            'id': str(self.id),
            'name': self.name,
            'email': self.email,
            'date_of_birth': self.date_of_birth,
            'role': self.role,
        }
