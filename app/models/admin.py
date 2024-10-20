from app.models.base.account import Account
from app.models.enum.account_role import AccountRole


class Admin(Account):
    def jsonify(self):
        return super().jsonify() | {
            'role': AccountRole.ADMIN.value
        }
