from datetime import datetime

from bson import ObjectId
from mongoengine import EmbeddedDocument, ObjectIdField, EnumField, StringField, DateTimeField, BooleanField
from ..enum.notification_type import NotificationType

class Notification(EmbeddedDocument):
    _id = ObjectIdField(default=ObjectId, required=True, primary_key=True)
    type = EnumField(NotificationType, required=True)
    message = StringField(required=True)
    timestamp = DateTimeField(default=datetime.now())
    read = BooleanField(default=False)
