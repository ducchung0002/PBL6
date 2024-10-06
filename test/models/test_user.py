import unittest
from datetime import datetime

from mongoengine import connect, disconnect

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
        pass

    def tearDown(self):
        # This method will be called after each test
        User.objects.all().delete()

    def test_user_follow_relationship(self):
        user1 = User(username='john.doe', name='John Doe', email='john.doe@example.com', date_of_birth=datetime.now(), bio='Người ẩn danh').set_password('12345678').save()
        user2 = User(username='jane.doe', name='Jane Doe', email='jane.doe@example.com', date_of_birth=datetime.now()).set_password('87654321').save()
        user3 = User(username='lionel.messi', name='Lionel Messi', email='lionel.messi', date_of_birth=datetime.now()).set_password('88888888').save()




if __name__ == '__main__':
    unittest.main()
