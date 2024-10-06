from app.models.base.extended_account import ExtendedAccount
from app.models.enum.account_role import AccountRole


class Artist(ExtendedAccount):
    def save(self, **kwargs):
        self.role = AccountRole.ARTIST.value
        return super().save(**kwargs)

    def jsonify(self):
        return {
            'id': str(self.id),
            'name': self.name,
            'email': self.email,
            'role': self.role,
            'created_at': self.created_at,
            'updated_at': self.updated_at
        }