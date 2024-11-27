from mongoengine import EmbeddedDocument, IntField, StringField


class Lyric(EmbeddedDocument):
    order = IntField(required=True, min_value=1, max_value=32767)
    text = StringField(required=True)
    start_time = IntField(required=True, min_value=0)

    def jsonify(self):
        return {
            'order': self.order,
            'text': self.text,
            'start_time': self.start_time,
        }
