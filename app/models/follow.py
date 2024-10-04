from datetime import datetime

from mongoengine import DateTimeField, Document, LazyReferenceField, signals

from app.models.base.extended_account import ExtendedAccount


class Follow(Document):
    follower = LazyReferenceField(ExtendedAccount, required=True)
    following = LazyReferenceField(ExtendedAccount, required=True)

    created_at = DateTimeField(default=datetime.now())

    meta = {
        'collection': 'follows',
        'indexes': [
            {'fields': ('follower', 'following'), 'unique': True}
        ],
    }

    @classmethod
    def post_save(cls, sender, document, **kwargs):
        if kwargs.get('created', False):
            # Update database counts
            ExtendedAccount.objects(id=document.follower.id).update_one(inc__following_count=1)
            ExtendedAccount.objects(id=document.following.id).update_one(inc__followers_count=1)
            # Update in-memory counts
            document.follower.fetch().following_count += 1
            document.following.fetch().followers_count += 1


# trigger
signals.post_save.connect(Follow.post_save, sender=Follow)
# signals.post_delete.connect(Follow.post_delete, sender=Follow)