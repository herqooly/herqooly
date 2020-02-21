from django.db import models
from apps.common.fields import AutoCreatedField
from apps.common.fields import AutoLastModifiedField


class OrganizationItemMixin(models.Model):
    created_at = AutoCreatedField()
    updated_at = AutoLastModifiedField()

    created_by = models.IntegerField(default=1)
    parent_organization_id = models.IntegerField(default=1)

    class Meta:
        abstract = True
