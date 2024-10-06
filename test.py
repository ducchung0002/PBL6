from datetime import datetime, time

from mongoengine import connect

from app.models.artist import Artist
from app.models.embedded_document.comment import Comment
from app.models.embedded_document.lyric import Lyric
from app.models.genre import Genre
from app.models.music import Music
from app.models.user import User
from app.models.video import Video
from bson import ObjectId


connect('PBL6', uuidRepresentation='standard')


genre1 = Genre.objects.get(id=ObjectId('6700f8bd5ef0ad4763b9eb9c'))
genre2 = Genre.objects.get(id=ObjectId('6700f8bd5ef0ad4763b9eb9d'))
genre3 = Genre.objects.get(id=ObjectId('6700f8bd5ef0ad4763b9eb9e'))

artist1 = Artist.objects.get(id=ObjectId('6700f8bd5ef0ad4763b9eb9f'))
artist2 = Artist.objects.get(id=ObjectId('6700f8bd5ef0ad4763b9eba0'))

user1 = User.objects.get(id=ObjectId('6700f8be5ef0ad4763b9eba1'))

lyrics1 = Lyric(order=1, text='Thiên lý ơi em có thể ở lại đây không', start_time='00:00:01.123',
                end_time='00:00:04.456', artist_index=0)
lyrics2 = Lyric(order=2, text='Chạy ngay đi', artist_index=1).set_start_time(
    time(0, 0, 5, 678)).set_end_time('00:00:07.901')

music1 = Music.objects.get(id=ObjectId('6700f8be5ef0ad4763b9eba2'))

Video(user=user1, music=music1,
      video_url='https://res.cloudinary.com/dxfwodlfi/video/upload/v1728120333/y2mate.com_-_M%E1%BB%99t_Ng%C3%A0y_%C4%90i_L%C3%A0m_c%C3%B9ng_Nghi%C3%AAn_C%E1%BB%A9u_Sinh_Ti%E1%BA%BFn_S%C4%A9_Ng%C3%A0nh_AI_t%E1%BA%A1i_%C3%9Ac_720pFHR_b3hy7n.mp4',
      like_count=69, comments=[Comment(user=user1, content='Good good!')]).save()
