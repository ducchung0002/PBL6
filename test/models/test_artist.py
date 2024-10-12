import unittest
from datetime import datetime

from mongoengine import connect, disconnect

from app.models.artist import Artist
from app.models.user import User


class TestArtist(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        # This method will be called before any test class
        connect('PBL6_test', uuidRepresentation='standard')

    @classmethod
    def tearDownClass(cls):
        # This method will be called after any test class
        disconnect()

    def setUp(self):
        self.artist1 = Artist(username='john.doe', name='John Doe', email='john.doe@example.com', date_of_birth=datetime.now(), bio='Người ẩn danh').set_password('12345678')
        self.artist2 = Artist(username='jane.doe', name='Jane Doe', email='jane.doe@example.com', date_of_birth=datetime.now()).set_password('87654321')
        self.user1 = User(username='lionel.messi', name='Lionel Messi', email='lionel.messi@example.com', date_of_birth=datetime.now()).set_password('88888888')

    def tearDown(self):
        # This method will be called after each test
        Artist.objects.all().delete()
        User.objects.all().delete()

    def test_user_follow_relationship(self):
        self.artist1.save()
        self.artist2.save()
        self.user1.save()

        self.assertEqual(Artist.objects.count(), 2)
        self.assertTrue(self.artist1.check_password('12345678'))
        self.assertEqual(User.objects.count(), 1)


if __name__ == '__main__':
    unittest.main()
