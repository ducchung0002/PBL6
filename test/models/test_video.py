import unittest
from datetime import datetime

from mongoengine import connect, disconnect
from typing_extensions import assert_type

from app.models.artist import Artist
from app.models.genre import Genre
from app.models.music import Music
from app.models.user import User
from app.models.video import Video


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
        self.user1 = User(username='john.doe', name='John Doe', email='john.doe@example.com', date_of_birth=datetime.now()).set_password(password='123456')
        self.user2 = User(username='jane.doe', name='Jane Doe', email='jane.doe@example.com', date_of_birth=datetime.now()).set_password(password='123456')
        self.user3 = User(username='lionel.messi', name='Lionel Messi', email='lionel.messi@example.com', date_of_birth=datetime.now()).set_password(password='123456')
        self.music1 = Music

    def tearDown(self):
        # This method will be called after each test
        User.objects.all().delete()
        Artist.objects.all().delete()
        Genre.objects.all().delete()
        Music.objects.all().delete()
        Video.objects.all().delete()

    def test_video_create(self):
        user1 = User(username='john.doe', name='John Doe', email='john.doe@example.com', date_of_birth=datetime.now()).set_password(password='123456')
        video1 = Video(user=user1, music=music1, title='Video 1').save()
        video2 = Video(user=user1, music=music1, title='Video 2').save()

        videos = Video.objects(user=user1.id).all()
        assert_type(videos, list)
        self.assertEqual(len(videos), 2)

        videos = Video.objects(user=user1).all()
        assert_type(videos, list)
        self.assertEqual(len(videos), 2)


if __name__ == '__main__':
    unittest.main()
