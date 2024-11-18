from mongoengine import StringField

from app.models.base.extended_account import ExtendedAccount
from app.models.enum.account_role import AccountRole
from app.models.query_set.artist_query_set import ArtistQuerySet


class Artist(ExtendedAccount):
    nickname = StringField()
    meta = {'queryset_class': ArtistQuerySet}

    def jsonify(self):
        return super().jsonify() | {
            'role': AccountRole.ARTIST.value,
            'nickname': self.nickname,
        }
