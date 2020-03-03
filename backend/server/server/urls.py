from django.contrib import admin
from django.urls import path, include

from apps.accounts.urls import urlpatterns as accounts_urlpatters
from apps.projects.urls import urlpatterns as projects_urlpatters

urlpatterns = [
    path("admin/", admin.site.urls),
]

urlpatterns += accounts_urlpatters
urlpatterns += projects_urlpatters


# add queue
urlpatterns += [path("django-rq/", include("django_rq.urls"))]
