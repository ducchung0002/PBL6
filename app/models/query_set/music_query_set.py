from mongoengine import QuerySet


class MusicQuerySet(QuerySet):
    def filter_by_artists(self, artist_id):
        return self.filter(artists__contains=artist_id).all()
