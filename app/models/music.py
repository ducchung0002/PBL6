from mongoengine import Document, StringField, DateTimeField
from datetime import datetime

class Music(Document):

    name = StringField(required=True)
    created_at = DateTimeField(default=datetime.utcnow)
    updated_at = DateTimeField(default=datetime.utcnow)
    lyric = StringField()
    uri = StringField(required=True)

    meta = {'collection': 'musics'}

    def create(self):
        if not self.created_at:
            self.created_at = datetime.utcnow()
        self.updated_at = datetime.utcnow()
        return self.save()

    @classmethod
    def get_all_music(cls):
        return cls.objects.all()
