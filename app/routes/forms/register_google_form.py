from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField, HiddenField
from wtforms.fields.datetime import DateField

from wtforms.validators import DataRequired, Email

class RegisterGoogleForm(FlaskForm):
    email = HiddenField('Email', validators=[DataRequired(), Email()])
    name = StringField('Họ và Tên', validators=[DataRequired()])
    date_of_birth = DateField('Ngày sinh', validators=[DataRequired()])
    submit = SubmitField('Tạo tài khoản')