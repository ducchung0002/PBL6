import unittest
from datetime import datetime

from mongoengine import connect, disconnect

from app.models.embedded_document.notification import Notification
from app.models.enum.notification_type import NotificationType
from app.models.user import User


class TestFollow(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        # This method will be called before any test class
        connect('PBL6_test', uuidRepresentation='standard')

    @classmethod
    def tearDownClass(cls):
        # This method will be called after any test class
        disconnect()

    def setUp(self):
        self.notification1 = Notification(type=NotificationType.VIDEO_LIKE, message='A da thich Video cua ban')
        self.notification2 = Notification(type=NotificationType.COMMENT_REPLY, message='comment nhu l')
        self.user1 = User(username='john.doe', name='John Doe', email='john.doe@example.com', date_of_birth=datetime.now(), bio='Người ẩn danh', notifications=[self.notification1, self.notification2]).set_password('12345678').save()


    def tearDown(self):
        # This method will be called after each test
        User.objects.all().delete()

    def test_user_notification(self):
        self.user1.save()
        print('')

