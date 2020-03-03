from django.db import models
from apps.common.organization_item_mixin import OrganizationItemMixin


class Project(OrganizationItemMixin):
    title = models.TextField()
    description = models.TextField(blank=True, null=True)
    slug = models.TextField()


class ProjectItemMixin(OrganizationItemMixin):
    parent_project = models.ForeignKey(Project, on_delete=models.CASCADE)

    class Meta:
        abstract = True


class Script(ProjectItemMixin):
    title = models.TextField()
    slug = models.TextField()

    code = models.TextField(blank=True, null=True, default="[]")
    notebook_file = models.TextField(blank=True, null=True)
    script_file = models.TextField(blank=True, null=True)

    interval = models.IntegerField(default=0)  # interval of repeat


class Widget(ProjectItemMixin):
    widgetUid = models.TextField()  # widgetUid and cellUid are the same
    widget_type = models.TextField()
    cellUid = models.TextField()

    data = models.TextField(blank=True, null=True)
    layout = models.TextField(blank=True, null=True)
    style = models.TextField(blank=True, null=True)
    visible = models.TextField(blank=True, null=True)

    parent_script = models.ForeignKey(Script, on_delete=models.CASCADE)


class ScriptItemMixin(ProjectItemMixin):
    parent_script = models.ForeignKey(Script, on_delete=models.CASCADE)

    class Meta:
        abstract = True


class ScriptSession(ScriptItemMixin):
    kernel_id = models.TextField()


class AppShareLink(ScriptItemMixin):
    uid = models.TextField()
    config = models.TextField()
    counter = models.IntegerField(default=0)


class File(ProjectItemMixin):

    title = models.TextField()
    description = models.TextField(blank=True, null=True)
    location = models.CharField(max_length=1024)
    file_name = models.CharField(max_length=256)  # file name from upload
    file_size = models.IntegerField()  # in B


class Secret(ProjectItemMixin):

    key = models.TextField()
    value = models.TextField()
