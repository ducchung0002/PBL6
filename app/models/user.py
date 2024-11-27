from mongoengine import LazyReferenceField, ListField

from app.models.enum.account_role import AccountRole
from app.models.base.extended_account import ExtendedAccount
from app.models.query_set.user_query_set import UserQuerySet


class User(ExtendedAccount):
    favourite_genres = ListField(LazyReferenceField('Genre'))  # Embedded list field for favourite genres

    meta = {'queryset_class': UserQuerySet}

    def jsonify(self):
        return super().jsonify() | {
            'role': AccountRole.USER.value,
        }

    def to_dict(self):
        return {
            'id': str(self.id),
            'username': self.username,
            'email': self.email
        }
