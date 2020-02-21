from django.test import TestCase
from rest_framework.test import APIClient


class UserInfoViewTests(TestCase):
    def test_user_info_view(self):
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION="Token dummy_token")
        url = "/api/v1/users/me"
        response = client.get(url, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["username"], "user")
        self.assertEqual(response.data["organizations"][0], "personal")

    def test_wrong_auth(self):
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION="Token wrong_token")
        url = "/api/v1/users/me"
        response = client.get(url, format="json")
        self.assertEqual(response.status_code, 401)
