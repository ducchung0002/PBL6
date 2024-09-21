from app.models.base.extended_account import ExtendedAccount
from app.models.enum.account_role import AccountRole


class Artist(ExtendedAccount):
    def save(self, **kwargs):
        self.role = AccountRole.ARTIST.value
        return super().save(**kwargs)
