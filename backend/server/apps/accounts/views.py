import os
from rest_framework import views, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from apps.jupyter.client import JupyterClient


class UserInfoView(views.APIView):

    permission_classes = (IsAuthenticated,)

    def get(self, request):

        url_arr = request.META['HTTP_REFERER'].split(":")
        url = "http:" + url_arr[1] + ":8888"
        ws_url = url_arr[1][2:] + ":8888"
        
        os.environ["JUPYTER_URL"] = url
        os.environ["JUPYTER_WS_URL"] = ws_url
        os.environ["JUPYTER_TOKEN"] = "my_very_secret_token"
        
        print("JUPYTER URLs")
        print("REST API:", os.environ["JUPYTER_URL"])
        print("WS:", os.environ["JUPYTER_WS_URL"])

        jc = JupyterClient()

        if not jc.is_available():
            return Response(
                "Connection to Jupyter is not available",
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )

        if not jc.can_authenticate():
            return Response(
                "Cannot autheticate in Jupyter. Please check your Jupyter token configuration",
                status=status.HTTP_403_FORBIDDEN,
            )

        return Response(
            {
                "username": "user",
                "organizations": [{"slug": "personal", "name": "Personal"}],
                "jupyter": {
                    "url": os.environ.get("JUPYTER_URL"),
                    "ws": os.environ.get("JUPYTER_WS_URL"),
                    "token": os.environ.get("JUPYTER_TOKEN"),
                },
            }
        )
