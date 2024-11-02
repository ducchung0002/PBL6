from mongoengine import QuerySet

from app.models.video import Video


class ExtendedAccountQuerySet(QuerySet):
    def get_videos(self, user_id: str):
        return Video.objects(user=user_id)
