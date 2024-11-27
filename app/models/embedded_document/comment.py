from datetime import datetime

from bson import ObjectId
from mongoengine import DateTimeField, EmbeddedDocument, IntField, LazyReferenceField, ObjectIdField, StringField


class Comment(EmbeddedDocument):
    _id = ObjectIdField(default=ObjectId, required=True, primary_key=True)
    user = LazyReferenceField('ExtendedAccount', required=True)
    father_comment_id = ObjectIdField(required=False, default=None)  # Store parent comment's _id
    father_comment_user = LazyReferenceField('ExtendedAccount', default=None)
    grand_comment_id = ObjectIdField(required=False, default=None)
    content = StringField(required=True)
    like_count = IntField(default=0)
    child_count = IntField(default=0)
    created_at = DateTimeField(default=datetime.now())

    def jsonify(self):
        user = self.user.fetch()
        father_comment_user = self.father_comment_user.fetch() if self.father_comment_user else None

        json = {
            'id': str(self._id),
            # 'user': self.user.fetch().jsonify(),
            'user': {
                'id': str(user.id),
                'name': user.name,
                'avatar_url': user.avatar_url  # Đảm bảo trả về URL avatar
            },
            'father_comment_id': str(self.father_comment_id),
            'grand_comment_id': str(self.grand_comment_id),
            'content': self.content,
            'like_count': self.like_count,
            'child_count': self.child_count,
            'created_at': self.created_at,
        }

        if father_comment_user:
            json['father_comment_user'] = {
                'id': str(father_comment_user.id),
                'name': father_comment_user.name
            }

        return json

    def id(self):
        return self._id

    @classmethod
    def from_dict(cls, **data):
        return cls(
            _id=data.get('_id'),
            user=data.get('user'),
            content=data.get('content'),
            father_comment_id=data.get('father_comment_id'),
            grand_comment_id=data.get('grand_comment_id'),
            like_count=data.get('like_count', 0),
            child_count=data.get('child_count', 0),
            created_at=data.get('created_at'),
            father_comment_user=data.get('father_comment_user')
        )

    @property
    def id(self):
        return self._id
