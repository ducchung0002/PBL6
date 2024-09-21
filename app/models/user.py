from mongoengine import LazyReferenceField, ListField

from .base.extended_account import ExtendedAccount
from .genre import Genre


class User(ExtendedAccount):
    favourite_genres = ListField(LazyReferenceField(Genre))  # Embedded list field for favourite genres