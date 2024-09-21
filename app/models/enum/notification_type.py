from enum import Enum


class NotificationType(Enum):
    VIDEO_LIKE = "video like"
    COMMENT_LIKE = "comment like"
    COMMENT_REPLY = "comment reply"
