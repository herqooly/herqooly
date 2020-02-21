from django.conf.urls import url, include

from apps.accounts.views import UserInfoView

urlpatterns = [
    url(r"^api/v1/users/me", UserInfoView.as_view(), name="user_info"),
]
