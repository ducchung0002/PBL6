from mongoengine import QuerySet


class VideoQuerySet(QuerySet):
    def get_videos_by_user(self, user_id: str):
        return self.filter(user=user_id).all()
