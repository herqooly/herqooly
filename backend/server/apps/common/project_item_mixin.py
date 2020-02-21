from django.db import models
from apps.projects.models import Project
from apps.common.organization_item_mixin import OrganizationItemMixin


class ProjectItemMixin(OrganizationItemMixin):
    parent_project = models.ForeignKey(Project, on_delete=models.CASCADE)

    class Meta:
        abstract = True
