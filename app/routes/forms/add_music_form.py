from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField
from wtforms.fields.datetime import DateField
from wtforms.validators import DataRequired, Email

class AddMusicForm(FlaskForm):
    name = StringField('Tên bài hát', validators=[DataRequired()])
    lyric = StringField('Lời bài hát', validators=[DataRequired()])
    uri = StringField('Đường dẫn bài hát', validators=[DataRequired()])
    submit = SubmitField('Thêm bài hát')