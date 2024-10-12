# from bson import ObjectId
# from mongoengine import connect
#
# from app.models.artist import Artist
# from app.models.base.account import Account
# from app.models.base.extended_account import ExtendedAccount
# from app.models.user import User
# from app.models.embedded_document.comment import Comment
# from app.models.video import Video
# from app.models import Music
# from app.models.embedded_document.word import Word

# connect('PBL6', uuidRepresentation='standard')
# connect(db='karaoke', host="mongodb+srv://ducchung2444:emyeucothanh@karaoke.bjdua.mongodb.net/?retryWrites=true&w=majority")
# for acc in ExtendedAccount.objects():
#     print(acc.id, acc.username, acc.name)

import json

# Path to your JSON file
file_path = 'lyric.json'

# Open and read the JSON file
with open(file_path, 'r', encoding='utf-8') as file:
    data = json.load(file)


lyrics = []

for sentence in data['data']['sentences']:
    line = []
    for word in sentence['words']:
        # line.append(Word(word=word['data'], start_time=word['startTime'], end_time=word['endTime']))
        line.append({'word': word['data'], 'start_time': word['startTime'], 'end_time': word['endTime']})
    lyrics.append(line)

output_file = "out.json"

with open(output_file, "w", encoding="utf-8") as file:
    json.dump(lyrics, file, indent=4, ensure_ascii=False)

# music = Music.objects(id='6746ac10bfacf4edb3e5f58c').first()
# music.lyrics = lyrics
# music.save()

# print(ExtendedAccount.objects(id=ObjectId('670ba36e5aa8524c955e32ff')).first().jsonify())



# Artist(username='jack97', name='Dang Nhat Minh', email='jack97@gmail.com', date_of_birth='2003-10-28').set_password('123456').save()
# Artist(username='sontung', name='Dang Nhat Minh', email='sontung@gmail.com', date_of_birth='2003-10-28').set_password('123456').save()
# User(username='nhatminh2', name='Dang Nhat Minh', email='nhatminh2@gmail.com', date_of_birth='2003-10-28').set_password('123456').save()
# User(username='nhatminh3', name='Dang Nhat Minh', email='nhatminh3@gmail.com', date_of_birth='2003-10-28').set_password('123456').save()
# User(username='nhatminh4', name='Dang Nhat Minh', email='nhatminh4@gmail.com', date_of_birth='2003-10-28').set_password('123456').save()
# User(username='nhatminh5', name='Dang Nhat Minh', email='nhatminh5@gmail.com', date_of_birth='2003-10-28').set_password('123456').save()
# User(username='nhatminh6', name='Dang Nhat Minh', email='nhatminh6@gmail.com', date_of_birth='2003-10-28').set_password('123456').save()
# User(username='nhatminh7', name='Dang Nhat Minh', email='nhatminh7@gmail.com', date_of_birth='2003-10-28').set_password('123456').save()
# User(username='nhatminh8', name='Dang Nhat Minh', email='nhatminh8@gmail.com', date_of_birth='2003-10-28').set_password('123456').save()


# genre1 = Genre.objects.get(id=ObjectId('6700f8bd5ef0ad4763b9eb9c'))
# genre2 = Genre.objects.get(id=ObjectId('6700f8bd5ef0ad4763b9eb9d'))
# genre3 = Genre.objects.get(id=ObjectId('6700f8bd5ef0ad4763b9eb9e'))
#
# artist1 = Artist.objects.get(id=ObjectId('6700f8bd5ef0ad4763b9eb9f'))
# artist2 = Artist.objects.get(id=ObjectId('6700f8bd5ef0ad4763b9eba0'))
#
# user1 = User.objects.get(id=ObjectId('6700f8be5ef0ad4763b9eba1'))
#
# lyrics1 = Lyric(order=1, text='Thiên lý ơi em có thể ở lại đây không', start_time='00:00:01.123',
#                 end_time='00:00:04.456', artist_index=0)
# lyrics2 = Lyric(order=2, text='Chạy ngay đi', artist_index=1).set_start_time(
#     time(0, 0, 5, 678)).set_end_time('00:00:07.901')
#
# music1 = Music.objects.get(id=ObjectId('6700f8be5ef0ad4763b9eba2'))
#
# Video(user=user1, music=music1,
#       video_url='https://res.cloudinary.com/dxfwodlfi/video/upload/v1728120333/y2mate.com_-_M%E1%BB%99t_Ng%C3%A0y_%C4%90i_L%C3%A0m_c%C3%B9ng_Nghi%C3%AAn_C%E1%BB%A9u_Sinh_Ti%E1%BA%BFn_S%C4%A9_Ng%C3%A0nh_AI_t%E1%BA%A1i_%C3%9Ac_720pFHR_b3hy7n.mp4',
#       like_count=69, comments=[Comment(user=user1, content='Good good!')]).save()
