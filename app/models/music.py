from datetime import datetime

from mongoengine import DateTimeField, Document, EmbeddedDocumentField, LazyReferenceField, ListField, StringField, \
    URLField


class Music(Document):
    name = StringField(required=True)
    artists = ListField(LazyReferenceField('Artist'), required=True)
    genres = ListField(LazyReferenceField('Genre'), required=True)
    audio_url = URLField()
    karaoke_url = URLField()
    lyrics = ListField(EmbeddedDocumentField('Lyric'))

    created_at = DateTimeField(default=datetime.now())
    updated_at = DateTimeField(default=datetime.now())
    deleted_at = DateTimeField()

    meta = {'collection': 'musics'}

    def create(self):
        if not self.created_at:
            self.created_at = datetime.now()
        self.updated_at = datetime.now()
        return self.save()

    def jsonify(self, *args, **kwargs):
        return {
            'id': str(self.id),
            'name': self.name,
            'artists': [artist.fetch().jsonify() for artist in self.artists],
            'genres': [genre.fetch().jsonify() for genre in self.genres],
            'audio_url': self.audio_url,
            'karaoke_url': self.karaoke_url,
            'lyrics': [lyric.jsonify() for lyric in self.lyrics],
        }

    @classmethod
    def get_all_music(cls):
        return cls.objects.all()
