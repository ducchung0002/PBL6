from mongoengine import Document, EmbeddedDocumentField, FloatField, LazyReferenceField, ListField, StringField, DateTimeField, URLField
from datetime import datetime
from mongoengine import signals

# from app.models.artist import Artist
from app.models.embedded_document.lyric import Lyric
from app.models.genre import Genre


class Music(Document):
    name = StringField(required=True)
    artists = ListField(LazyReferenceField('Artist'), required=True)
    genres = ListField(LazyReferenceField(Genre), required=True)
    music_url = URLField()
    metric_url = URLField()
    lyrics = ListField(EmbeddedDocumentField(Lyric))
    name_embedded = ListField(FloatField())

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
            'music_url': self.music_url,
            'metric_url': self.metric_url,
            'lyrics': [lyric.jsonify() for lyric in self.lyrics],
            'name_embedded': self.name_embedded,
        }

    @classmethod
    def get_all_music(cls):
        return cls.objects.all()

    @classmethod
    def post_save(cls, sender, document, **kwargs):
        if document.deleted_at:
            signals.post_save.send(sender, instance=document, deleted_at=document.deleted_at, **kwargs)

signals.post_save.connect(Music.post_save, sender=Music)