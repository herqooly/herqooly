from django.conf.urls import url, include
from rest_framework.routers import DefaultRouter

from apps.projects.views import ProjectViewSet
from apps.projects.views import ScriptViewSet
from apps.projects.views import WidgetViewSet
from apps.projects.views import KernelView
from apps.projects.views import SaveScriptView
from apps.projects.views import ScriptCellsViewSet
from apps.projects.views import AppShareLinkViewSet
from apps.projects.views import SharedWidgetsViewSet
from apps.projects.views import FileViewSet
from apps.projects.views import QueueView
from apps.projects.views import SecretViewSet

router = DefaultRouter(trailing_slash=False)
router.register(
    r"(?P<organization_slug>.+)/projects", ProjectViewSet, basename="projects"
)

router.register(
    r"(?P<organization_slug>.+)/(?P<project_id>.+)/scripts",
    ScriptViewSet,
    basename="scripts",
)


router.register(
    r"(?P<organization_slug>.+)/(?P<project_id>.+)/script_cells",
    ScriptCellsViewSet,
    basename="script_cells",
)


router.register(
    r"(?P<organization_slug>.+)/(?P<project_id>.+)/(?P<script_id>.+)/widgets",
    WidgetViewSet,
    basename="widgets",
)

router.register(
    r"(?P<project_id>.+)/(?P<location>.+)/files", FileViewSet, basename="files",
)

router.register(
    r"(?P<organization_slug>.+)/(?P<project_id>.+)/secrets",
    SecretViewSet,
    basename="secrets",
)


urlpatterns = [
    url(r"^api/v1/", include(router.urls)),
    url(
        r"^api/v1/(?P<organization_slug>.+)/(?P<project_id>.+)/(?P<script_id>.+)/kernel$",
        KernelView.as_view(),
        name="kernel",
    ),
    url(
        r"^api/v1/(?P<organization_slug>.+)/(?P<project_id>.+)/(?P<script_id>.+)/save_script$",
        SaveScriptView.as_view(),
        name="save_script",
    ),
    url(
        r"^api/v1/(?P<script_id>.+)/links$",
        AppShareLinkViewSet.as_view(),
        name="links",
    ),
    url(
        r"^api/v1/(?P<share_uid>.+)/shared$",
        SharedWidgetsViewSet.as_view(),
        name="shared",
    ),
    url(
        r"^api/v1/queue/(?P<script_id>.+)$",
        QueueView.as_view(),
        name="queue",
    ),
]
