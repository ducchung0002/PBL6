import unittest
from datetime import datetime

from mongoengine import connect, disconnect

from app.models.follow import Follow
from app.models.user import User
from app.models.artist import Artist


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

        self.artist1 = Artist(username='ronaldo', name='Ronaldo', email='ronaldo@example.com', date_of_birth=datetime.now()).set_password(password='123456')
        self.artist2 = Artist(username='neymar', name='Neymar', email='neymar@example.com', date_of_birth=datetime.now()).set_password(password='123456')
        self.artist3 = Artist(username='cristiano', name='Cristiano Ronaldo', email='cristiano@example.com', date_of_birth=datetime.now()).set_password(password='123456')

    def tearDown(self):
        # This method will be called after each test
        Follow.objects.all().delete()
        User.objects.all().delete()
        Artist.objects.all().delete()

    def test_user_follow_relationship(self):
        self.user1.save()
        self.user2.save()
        self.user3.save()

        self.artist1.save()
        self.artist2.save()
        self.artist3.save()

        # Create follow relationship
        follow_u1u2 = Follow(follower=self.user1, following=self.user2).save()
        follow_u1u3 = Follow(follower=self.user1, following=self.user3).save()
        follow_u2u3 = Follow(follower=self.user2, following=self.user3).save()

        follow_u1a1 = Follow(follower=self.user1, following=self.artist1).save()
        follow_a1u3 = Follow(follower=self.artist1, following=self.user3).save()
        follow_a3u2 = Follow(follower=self.artist3, following=self.user2).save()

        # Reload the user instances to fetch the updated counts
        self.user1.reload()
        self.user2.reload()
        self.user3.reload()

        self.artist1.reload()
        self.artist2.reload()
        self.artist3.reload()

        # Test the relationship
        self.assertEqual(Follow.objects.count(), 6)

        self.assertEqual(self.user1.following_count, 3)
        self.assertEqual(self.user1.followers_count, 0)

        self.assertEqual(self.user2.followers_count, 2)
        self.assertEqual(self.user2.following_count, 1)

        self.assertEqual(self.user3.followers_count, 3)
        self.assertEqual(self.user3.following_count, 0)

        # Test artist follow relationship
        self.assertEqual(Follow.objects(follower=self.user1).count(), 3)
        self.assertEqual(Follow.objects(following=self.user3).count(), 3)