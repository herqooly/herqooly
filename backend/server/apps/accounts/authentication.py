from addict import Dict
from rest_framework.authentication import TokenAuthentication


class DummyTokenAuthentication(TokenAuthentication):
    def authenticate_credentials(self, key):
        if key != "dummy_token":
            return None
        # mock user and token models
        return (
            Dict(
                {
                    "username": "user",
                    "is_staff": False,
                    "is_active": True,
                    "is_superuser": False,
                    "is_authenticated": True,
                    "is_anonymous": False,
                }
            ),
            Dict({"key": "dummy_token"}),
        )
