from mongoengine import EmbeddedDocument, IntField, ListField


class Score(EmbeddedDocument):
    rhythm = ListField(IntField())
    pitch = ListField(IntField())
    statbility = ListField(IntField())
