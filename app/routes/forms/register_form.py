from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField
from wtforms.fields.datetime import DateField
from wtforms.validators import DataRequired, Email


class RegisterForm(FlaskForm):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.csrf_token.id = 'register_csrf_token'

    csrf_token = StringField()
    email = StringField('Email', validators=[DataRequired(), Email()])
    username = StringField('Tên người dùng', validators=[DataRequired()])
    password = PasswordField('Mật khẩu', validators=[DataRequired()])
    name = StringField('Họ và tên', validators=[DataRequired()])
    date_of_birth = DateField('Ngày sinh', validators=[DataRequired()])
    submit = SubmitField('Tạo tài khoản')
