from enum import Enum

class TaskFailType(Enum):
    UPLOAD_MUSIC_AUDIO = 'music audio'
    UPLOAD_MUSIC_KARAOKE = 'music karaoke'
    UPLOAD_MUSIC_THUMBNAIL = 'music thumbnail'
    SAVE_ERROR = 'save error'