import time
import copy
import json
import uuid

from django.db import transaction
from django.template.defaultfilters import slugify
from django.core.exceptions import ObjectDoesNotExist

from rest_framework.exceptions import NotFound
from rest_framework import viewsets, views, status, generics
from rest_framework.response import Response
from rest_framework.exceptions import APIException
from rest_framework import mixins

from apps.projects.models import (
    Project,
    Script,
    ScriptSession,
    Widget,
    AppShareLink,
    File,
)
from apps.projects.serializers import (
    ProjectSerializer,
    ScriptSerializer,
    WidgetSerializer,
    ScriptCellsSerializer,
    AppShareLinkSerializer,
    FileSerializer,
)
from apps.common.permissions import DummyPermission

from apps.jupyter.client import JupyterClient


class ProjectViewSet(viewsets.ModelViewSet):

    serializer_class = ProjectSerializer
    queryset = Project.objects.all()
    permission_classes = (DummyPermission,)

    def perform_create(self, serializer):
        print("perform create")
        try:
            with transaction.atomic():
                instance = serializer.save(
                    created_by=1, parent_organization_id=1, slug="tmp_slug"
                )
                instance.slug = "{0}_{1}".format(slugify(instance.title), instance.id)
                instance.save()

                jc = JupyterClient()
                if not jc.create_project_directory(instance.slug):
                    raise Exception("Cannot create project directory in the Jupyter")

        except Exception as e:
            raise APIException(str(e))

    def perform_destroy(self, instance):
        print("perform_destroy")
        try:
            with transaction.atomic():
                instance.delete()

                # just delete in the DB
                # TODO add delete in jupyter
                #jc = JupyterClient()
                #if not jc.delete_project_directory(instance.slug):
                #    raise Exception("Cannot delete project directory in the Jupyter")

        except Exception as e:
            raise APIException(str(e))


class ScriptViewSet(viewsets.ModelViewSet):

    serializer_class = ScriptSerializer
    # queryset = Script.objects.all()
    permission_classes = (DummyPermission,)

    def get_queryset(self):
        print("get scripts")
        project_id = self.kwargs.get("project_id")
        print("p_id", project_id)
        return Script.objects.filter(parent_project__id=project_id)

    def perform_create(self, serializer):
        print("perform create")
        try:
            with transaction.atomic():
                project_id = self.kwargs.get("project_id")
                print("p_id", project_id)
                instance = serializer.save(
                    created_by=1,
                    parent_organization_id=1,
                    parent_project_id=int(project_id),
                    slug="tmp_slug",
                )
                instance.slug = "{0}_{1}".format(slugify(instance.title), instance.id)
                instance.save()

                for c in [
                    "static"
                ]:  # , "execute"]: # please wait a while for this feature
                    AppShareLink(
                        uid=str(uuid.uuid4()).replace("-", ""),
                        config=c,
                        parent_script=instance,
                        parent_project=instance.parent_project,
                    ).save()

                # jc = JupyterClient()
                # if not jc.create_project_directory(instance.slug):
                #    raise Exception("Cannot create project directory in the Jupyter")

        except Exception as e:
            raise e
            raise APIException(str(e))


class ScriptCellsViewSet(mixins.RetrieveModelMixin, viewsets.GenericViewSet):

    serializer_class = ScriptCellsSerializer
    permission_classes = (DummyPermission,)
    queryset = Script.objects.all()


class AppShareLinkViewSet(generics.ListAPIView):

    serializer_class = AppShareLinkSerializer
    permission_classes = (DummyPermission,)
    queryset = AppShareLink.objects.all()

    def get_queryset(self):
        script_id = self.kwargs.get("script_id")
        return AppShareLink.objects.filter(parent_script__id=script_id)


class SharedWidgetsViewSet(generics.ListAPIView):

    serializer_class = WidgetSerializer
    # no permissions, if you have link with UID you have access

    def get_queryset(self):
        share_uid = self.kwargs.get("share_uid")
        try:
            share_link = AppShareLink.objects.get(uid=share_uid)
        except ObjectDoesNotExist as e:
            raise NotFound()
        print(share_link)
        return Widget.objects.filter(parent_script=share_link.parent_script)


class WidgetViewSet(
    mixins.RetrieveModelMixin,
    mixins.ListModelMixin,
    viewsets.GenericViewSet,
    mixins.DestroyModelMixin,
):

    serializer_class = WidgetSerializer
    permission_classes = (DummyPermission,)

    def get_queryset(self):
        print("get widgets")
        project_id = self.kwargs.get("project_id")
        script_id = self.kwargs.get("script_id")
        return Widget.objects.filter(
            parent_project__id=project_id, parent_script__id=script_id
        )


class KernelView(views.APIView):
    def create_new_script_session(self, project_id, script_id):
        kernel_id = None
        kernel_execution_state = None
        with transaction.atomic():
            jc = JupyterClient()
            kernel = jc.start_kernel()
            if kernel is not None:
                ScriptSession(
                    kernel_id=kernel["id"],
                    parent_organization_id=1,
                    parent_project_id=project_id,
                    parent_script_id=script_id,
                ).save()
                kernel_id = kernel["id"]
                kernel_execution_state = kernel["execution_state"]
        return kernel_id, kernel_execution_state

    def post(self, request, organization_slug, project_id, script_id, format=None):

        action = self.request.data.get("action")  # start, shutdown
        if not action in ["start", "shutdown", "interrupt", "restart"]:
            return Response(status=status.HTTP_404_NOT_FOUND)
        kernel_id = self.request.data.get("kernelId")
            
            

        kernels_running = JupyterClient().get_kernels()
        if kernels_running is None:
            return Response(status=status.HTTP_404_NOT_FOUND)
        for k in kernels_running:
            print("Running: {}".format(k["id"]))

        #session = ScriptSession.objects.filter(
        #    parent_project__id=project_id, parent_script__id=script_id
        #)

        if action == "start":

            ###
            try:
                script = Script.objects.get(pk=script_id)
            except ObjectDoesNotExist as e:
                return Response(status=status.HTTP_404_NOT_FOUND)

            script_path = "sandbox/" + script.parent_project.slug + "/src"
            script_name = script.slug + ".ipynb"
            script_path += "/" + script_name
            ses = JupyterClient().start_session(path=script_path, name=script_name)
            print("SESSION", ses)
            return Response(
                    {"id": ses["kernel"]["id"], "execution_state": ses["kernel"]["execution_state"]}
                )
            ###

        elif action == "shutdown":
            for s in session:
                jc = JupyterClient()
                kernel = jc.shutdown_kernel(s.kernel_id)
                s.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)

        elif action == "interrupt":
            if kernel_id is None:
                return Response(status=status.HTTP_404_NOT_FOUND)
            jc = JupyterClient()
            if jc.interrupt_kernel(kernel_id):
                return Response(status=status.HTTP_200_OK)
            else:
                return Response(status=status.HTTP_404_NOT_FOUND)

        elif action == "restart":
            if kernel_id is None:
                return Response(status=status.HTTP_404_NOT_FOUND)
            jc = JupyterClient()
            if jc.restart_kernel(kernel_id):
                return Response(status=status.HTTP_200_OK)
            else:
                return Response(status=status.HTTP_404_NOT_FOUND)

        return Response(status=status.HTTP_404_NOT_FOUND)


class SaveScriptView(views.APIView):
    def post(self, request, organization_slug, project_id, script_id, format=None):

        try:
            script = Script.objects.get(pk=script_id)
        except ObjectDoesNotExist as e:
            return Response(status=status.HTTP_404_NOT_FOUND)

        cells = self.request.data.get("cells")
        plain_code = ""
        jupyter_nb_code = []
        for cell in cells:
            plain_code += cell["code"] + "\n"
            jupyter_nb_code += [
                {
                    "metadata": {"trusted": True, "cellUid": cell["cellUid"]},
                    "cell_type": "code",
                    "source": cell["code"],
                    "execution_count": None,
                    "outputs": [],
                }
            ]

        print("plain_code")
        print(plain_code)

        file_name = script.slug + ".py"
        file_path = "sandbox/" + script.parent_project.slug + "/src/"

        script.script_file = file_path + file_name

        print("Plain code", file_name, file_path)
        jc = JupyterClient()
        jc.write_file(file_name, file_path, plain_code)

        file_name = script.slug + ".ipynb"
        file_path = "sandbox/" + script.parent_project.slug + "/src/"

        script.notebook_file = file_path + file_name

        print("Jupyter Nb", file_name, file_path)
        jc = JupyterClient()
        jc.write_jupyter_nb_file(file_name, file_path, jupyter_nb_code)

        script.code = json.dumps(cells)
        script.save()

        current_widgets = Widget.objects.filter(parent_script=script)
        current_widgets_map = {}
        # do a dict mapping
        for w in current_widgets:
            current_widgets_map[w.widgetUid] = w

        widgets = self.request.data.get("widgets", [])

        for _, widget in widgets.items():
            if widget["widgetUid"] in current_widgets_map:
                # do update
                w = current_widgets_map[widget["widgetUid"]]
                w.widget_type = widget["widget_type"]
                w.data = json.dumps(widget["data"])
                w.layout = json.dumps(widget["layout"])
                w.style = json.dumps(widget["style"])
                w.visible = widget["visible"]
                w.save()
            else:  # create new widget
                w = Widget(
                    widgetUid=widget["widgetUid"],
                    widget_type=widget["widget_type"],
                    data=json.dumps(widget["data"]),
                    layout=json.dumps(widget["layout"]),
                    style=json.dumps(widget["style"]),
                    parent_script=script,
                    parent_project=script.parent_project,
                    cellUid=widget["cellUid"],
                    visible=widget["visible"],
                )
                w.save()

        return Response(status=status.HTTP_201_CREATED)


class FileViewSet(viewsets.ModelViewSet):

    serializer_class = FileSerializer
    permission_classes = (DummyPermission,)

    def get_queryset(self):
        project_id = self.kwargs.get("project_id")
        location = self.kwargs.get("location")
        return File.objects.filter(parent_project__id=project_id, location=location)

    def perform_create(self, serializer):
        try:
            with transaction.atomic():
                project_id = self.kwargs.get("project_id")

                instance = serializer.save(
                    created_by=1,
                    parent_organization_id=1,
                    parent_project_id=int(project_id),
                )
                instance.save()

        except Exception as e:

            raise APIException(str(e))

    def perform_destroy(self, instance):

        try:
            with transaction.atomic():

                file_path = None
                if instance.location == "uploaded":
                    file_path = "/".join(
                        [
                            instance.parent_project.slug,
                            "data",
                            "uploaded",
                            instance.file_name,
                        ]
                    )
                if file_path is not None:
                    jc = JupyterClient()
                    if not jc.delete_file(file_path):
                        raise Exception("Cannot delete file in the Jupyter")

                instance.delete()

        except Exception as e:
            print(e)
            raise APIException(str(e))
