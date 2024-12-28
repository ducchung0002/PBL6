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
        follow_u1u2 = Follow.objects.follow(follower_id=self.user1.id, following_id=self.user2.id)
        follow_u1u3 = Follow.objects.follow(follower_id=self.user1.id, following_id=self.user3.id)
        follow_u1a1 = Follow.objects.follow(follower_id=self.user1.id, following_id=self.artist1.id)

        follow_u2u3 = Follow.objects.follow(follower_id=self.user2.id, following_id=self.user3.id)

        follow_a1u3 = Follow.objects.follow(follower_id=self.artist1.id, following_id=self.user3.id)

        follow_a3u2 = Follow.objects.follow(follower_id=self.artist3.id, following_id=self.user2.id)

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

    def test_follow_unfollow_relationship(self):
        self.user1.save()
        self.user2.save()
        self.user3.save()

        self.artist1.save()
        self.artist2.save()
        self.artist3.save()

        # Create follow relationships
        Follow.objects.follow(follower_id=self.user1.id, following_id=self.user2.id)
        Follow.objects.follow(follower_id=self.user1.id, following_id=self.user3.id)
        Follow.objects.follow(follower_id=self.user1.id, following_id=self.artist1.id)

        Follow.objects.follow(follower_id=self.user2.id, following_id=self.user3.id)
        Follow.objects.follow(follower_id=self.artist1.id, following_id=self.user3.id)
        Follow.objects.follow(follower_id=self.artist3.id, following_id=self.user2.id)

        self.assertEqual(Follow.objects.count(), 6)

        # Unfollow relationships
        Follow.objects.unfollow(follower_id=self.user1.id, following_id=self.user2.id)
        Follow.objects.unfollow(follower_id=self.user1.id, following_id=self.user3.id)
        Follow.objects.unfollow(follower_id=self.user2.id, following_id=self.user3.id)

        Follow.objects.unfollow(follower_id=self.user1.id, following_id=self.artist1.id)
        Follow.objects.unfollow(follower_id=self.artist1.id, following_id=self.user3.id)
        Follow.objects.unfollow(follower_id=self.artist3.id, following_id=self.user2.id)

        # Reload the instances
        self.user1.reload()
        self.user2.reload()
        self.user3.reload()

        self.artist1.reload()
        self.artist2.reload()
        self.artist3.reload()

        self.assertEqual(self.user1.following_count, 0)
        self.assertEqual(self.user1.followers_count, 0)

        self.assertEqual(self.user2.followers_count, 0)
        self.assertEqual(self.user2.following_count, 0)

        self.assertEqual(self.user3.followers_count, 0)
        self.assertEqual(self.user3.following_count, 0)

        # Test follow counts after unfollow
        self.assertEqual(Follow.objects.count(), 0)

    def test_same_follow(self):
        self.user1.save()
        self.user2.save()

        follow_u1u2 = Follow.objects.follow(follower_id=self.user1.id, following_id=self.user2.id)
        self.user1.reload()
        self.assertEqual(self.user1.following_count, 1)
        follow_u1u2 = Follow.objects.follow(follower_id=self.user1.id, following_id=self.user2.id)
        self.assertEqual(self.user1.following_count, 1)

    def test_unfollow_unfollowed_user(self):
        self.user1.save()
        self.user2.save()

        unfollow_u1u2 = Follow.objects.unfollow(follower_id=self.user1.id, following_id=self.user2.id)

        self.assertEqual(self.user1.following_count, 0)
        self.assertEqual(self.user2.following_count, 0)

    def test_follow_self(self):
        self.user1.save()
        with self.assertRaises(ValueError):
            Follow.objects.follow(follower_id=self.user1.id, following_id=self.user1.id)

    def test_follow_artist(self):
        self.user1.save()
        self.artist1.save()

        Follow.objects.follow(follower_id=self.user1.id, following_id=self.artist1.id)

        self.user1.reload()
        self.artist1.reload()

        self.assertEqual(self.user1.following_count, 1)
        self.assertEqual(self.artist1.followers_count, 1)

    def test_follow_and_unfollow_artist(self):
        self.user1.save()
        self.artist1.save()

        Follow.objects.follow(follower_id=self.user1.id, following_id=self.artist1.id)
        Follow.objects.unfollow(follower_id=self.user1.id, following_id=self.artist1.id)

        self.user1.reload()
        self.artist1.reload()

        self.assertEqual(self.user1.following_count, 0)
        self.assertEqual(self.artist1.followers_count, 0)

    def test_multiple_followers_single_user(self):
        self.user1.save()
        self.user2.save()
        self.user3.save()

        Follow.objects.follow(follower_id=self.user1.id, following_id=self.user3.id)
        Follow.objects.follow(follower_id=self.user2.id, following_id=self.user3.id)

        self.user3.reload()

        self.assertEqual(self.user3.followers_count, 2)
        self.assertEqual(Follow.objects(following=self.user3.id).count(), 2)

    def test_following_counts_for_users_and_artists(self):
        self.user1.save()
        self.user2.save()
        self.artist1.save()
        self.artist2.save()

        Follow.objects.follow(follower_id=self.user1.id, following_id=self.user2.id)
        Follow.objects.follow(follower_id=self.user1.id, following_id=self.artist1.id)
        Follow.objects.follow(follower_id=self.user1.id, following_id=self.artist2.id)

        self.user1.reload()
        self.user2.reload()
        self.artist1.reload()
        self.artist2.reload()

        self.assertEqual(self.user1.following_count, 3)
        self.assertEqual(self.user2.followers_count, 1)
        self.assertEqual(self.artist1.followers_count, 1)
        self.assertEqual(self.artist2.followers_count, 1)
