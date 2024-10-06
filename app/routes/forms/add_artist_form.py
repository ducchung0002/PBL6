from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField
from wtforms.fields.datetime import DateField
from wtforms.validators import DataRequired, Email

class AddArtistForm(FlaskForm):
    name = StringField('Tên ca sĩ', validators=[DataRequired()])
    avatar_uri = StringField('Đường dẫn avatar', validators=[DataRequired()])
    email = StringField('Email', validators=[DataRequired(), Email()])
    submit = SubmitField('Thêm nghệ sĩ')