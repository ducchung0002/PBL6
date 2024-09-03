from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField
from wtforms.fields.datetime import DateField
from wtforms.validators import DataRequired, Email

class RegisterForm(FlaskForm):
    email = StringField('Email', validators=[DataRequired(), Email()])
    password = PasswordField('Mật khẩu', validators=[DataRequired()])
    name = StringField('Họ và tên', validators=[DataRequired()])
    date_of_birth = DateField('Ngày sinh', validators=[DataRequired()])
    submit = SubmitField('Tạo tài khoản')