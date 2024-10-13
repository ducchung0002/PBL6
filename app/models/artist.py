from app.models.base.extended_account import ExtendedAccount
from app.models.enum.account_role import AccountRole
from app.models.query_set.artist_query_set import ArtistQuerySet


class Artist(ExtendedAccount):
    meta = {'queryset_class': ArtistQuerySet}

    def jsonify(self):
        return {
            'id': str(self.id),
            'name': self.name,
            'email': self.email,
            'role': AccountRole.ARTIST.value,
            'created_at': self.created_at,
            'updated_at': self.updated_at
        }
