from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField
from wtforms.validators import DataRequired, Email


class LoginForm(FlaskForm):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.csrf_token.id = 'login_csrf_token'

    csrf_token = StringField()
    email = StringField('Email', validators=[DataRequired(), Email()])
    password = PasswordField('Mật khẩu', validators=[DataRequired()])
    submit = SubmitField('Đăng nhập')
