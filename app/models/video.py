from datetime import datetime

from mongoengine import DateTimeField, Document, EmbeddedDocumentField, IntField, LazyReferenceField, ListField, URLField

from app.models.embedded_document.score import Score
from app.models.music import Music
from app.models.user import User


class Video(Document):
    user = LazyReferenceField(User, required=True)
    music = LazyReferenceField(Music, required=True)
    score = EmbeddedDocumentField(Score)
    video_url = URLField()
    like_count = IntField()
    comments = ListField(EmbeddedDocumentField('Comment'))

    created_at = DateTimeField(default=datetime.now())
    updated_at = DateTimeField(default=datetime.now())
    deleted_at = DateTimeField()

    meta = {'collection': 'videos'}