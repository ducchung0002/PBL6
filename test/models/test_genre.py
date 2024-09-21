import unittest
from datetime import datetime

from mongoengine import connect, disconnect

from app.models.user import User
from app.models.genre import Genre


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
        self.genre1 = Genre(name='Pop', description='Pop music')
        self.genre2 = Genre(name='Rock', description='Rock music')
        self.genre3 = Genre(name='Jazz', description='Jazz music')
        self.user1 = User(username='lionel.messi', name='Lionel Messi', email='lionel.messi@example.com', date_of_birth=datetime.now(), favourite_genres=[self.genre1, self.genre3]).set_password('88888888')

    def tearDown(self):
        User.objects.all().delete()
        Genre.objects.all().delete()

    def test_favourite_genres(self):
        self.genre1.save()
        self.genre2.save()
        self.genre3.save()
        self.user1.save()

        self.assertEqual(Genre.objects.count(), 3)
        self.assertEqual(len(User.objects.first().favourite_genres), 2)
