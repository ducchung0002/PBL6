from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField
from wtforms.fields.datetime import DateField
from wtforms.validators import DataRequired, Email

class AddGenreForm(FlaskForm):
    name = StringField('Tên thể loại', validators=[DataRequired()])
    description = StringField('Mô tả')

    submit = SubmitField('Thêm thể loại')