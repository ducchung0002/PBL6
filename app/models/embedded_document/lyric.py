from datetime import time

from mongoengine import EmbeddedDocument, FloatField, IntField, ListField, StringField


class Lyric(EmbeddedDocument):
    order = IntField(required=True, min_value=1, max_value=32767)
    text = StringField(required=True)
    start_time = StringField(required=True, regex=r'^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)(\.\d{1,3})?$')
    end_time = StringField(required=True, regex=r'^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)(\.\d{1,3})?$')
    artist_index = IntField(required=True, min_value=0, max_value=255)
    vector = ListField(FloatField())

    def set_start_time(self, value):
        if isinstance(value, time):
            self.start_time = value.strftime('%H:%M:%S.%f')[:-3]
        elif isinstance(value, str):
            time.fromisoformat(value)
            self.start_time = value
        else:
            raise ValueError("start_time must be a time object or a string in HH:MM:SS.mmm format")
        return self

    def set_end_time(self, value):
        if isinstance(value, time):
            self.end_time = value.strftime('%H:%M:%S.%f')[:-3]
        elif isinstance(value, str):
            time.fromisoformat(value)
            self.end_time = value
        else:
            raise ValueError("start_time must be a time object or a string in HH:MM:SS.mmm format")
        return self
