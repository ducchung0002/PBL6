from app.models.base.account import Account
from app.models.enum.account_role import AccountRole


class Admin(Account):
    def jsonify(self):
        return {
            'id': str(self.id),
            'name': self.name,
            'user': self.username,
            'role': AccountRole.ADMIN.value,
            'created_at': self.created_at,
            'updated_at': self.updated_at
        }
