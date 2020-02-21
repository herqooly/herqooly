from django.test import TestCase
from rest_framework.test import APIClient

from apps.jupyter.client import JupyterClient
from apps.projects.models import Project, Script, Widget

"""
class KernelViewTests(TestCase):
    def tearDown(self):
        # close all kernels after each single test
        jc = JupyterClient()
        kernels = jc.get_kernels()
        for k in kernels:
            jc.shutdown_kernel(k["id"])

    def test_start_kernel(self):
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION="Token dummy_token")
        organization_slug = "personal"
        project_id = 1
        script_id = 1
        url = "/api/v1/{}/{}/{}/kernel".format(organization_slug, project_id, script_id)
        response = client.post(url, data={"action": "start"}, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertTrue("id" in response.json())
        self.assertTrue(response.json()["id"] is not None)

    def test_get_running_kernel(self):
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION="Token dummy_token")
        organization_slug = "personal"
        project_id = 1
        script_id = 1
        url = "/api/v1/{}/{}/{}/kernel".format(organization_slug, project_id, script_id)
        response = client.post(url, data={"action": "start"}, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertTrue("id" in response.json())
        self.assertTrue(response.json()["id"] is not None)

        id_previous = response.json()["id"]

        response = client.post(url, data={"action": "start"}, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["id"], id_previous)

    def test_shutdown_kernel(self):
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION="Token dummy_token")
        organization_slug = "personal"
        project_id = 1
        script_id = 1
        url = "/api/v1/{}/{}/{}/kernel".format(organization_slug, project_id, script_id)
        response = client.post(url, data={"action": "start"}, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertTrue("id" in response.json())
        self.assertTrue(response.json()["id"] is not None)

        response = client.post(url, data={"action": "shutdown"}, format="json")
        self.assertEqual(response.status_code, 204)
        self.assertEqual(len(JupyterClient().get_kernels()), 0)

"""


class SaveScriptViewTests(TestCase):
    def tearDown(self):
        # after each single test
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION="Token dummy_token")
        organization_slug = "personal"
        project_id = 1

        url = "/api/v1/{}/projects/{}".format(organization_slug, project_id)
        response = client.delete(url)
        self.assertEqual(response.status_code, 204)

    def test_save(self):

        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION="Token dummy_token")
        organization_slug = "personal"

        json_data = {"title": "test_project"}
        url = "/api/v1/{}/projects".format(organization_slug)
        response = client.post(url, data=json_data, format="json")
        project_id = response.json()["id"]

        json_data = {"title": "test_script"}
        url = "/api/v1/{}/{}/scripts".format(organization_slug, project_id)
        response = client.post(url, data=json_data, format="json")
        script_id = response.json()["id"]

        json_data = {
            "widgets": {
                "b9935d7f-ef5f-47db-aacc-6ca4a6f20c98": {
                    "widgetUid": "b9935d7f-ef5f-47db-aacc-6ca4a6f20c98",
                    "widget_type": "text_widget",
                    "data": {"text": "2"},
                    "style": {},
                    "layout": {
                        "i": "b9935d7f-ef5f-47db-aacc-6ca4a6f20c98",
                        "x": 0,
                        "y": 0,
                        "w": 6,
                        "h": 5,
                    },
                    "visible": True,
                    "cellUid": "a6419c4d-8135-4b40-8021-fe572035aea7",
                },
                "f39c6ce0-d2a3-41f3-adf2-705bd1dcb00e": {
                    "widgetUid": "f39c6ce0-d2a3-41f3-adf2-705bd1dcb00e",
                    "widget_type": "text_widget",
                    "data": {"text": "5"},
                    "style": {},
                    "layout": {
                        "i": "f39c6ce0-d2a3-41f3-adf2-705bd1dcb00e",
                        "x": 0,
                        "y": 0,
                        "w": 6,
                        "h": 5,
                    },
                    "visible": True,
                    "cellUid": "9eea0176-0f76-48ec-973f-6727efe44245",
                },
            },
            "cells": [
                {
                    "cellUid": "a6419c4d-8135-4b40-8021-fe572035aea7",
                    "code": "a = 2\na",
                    "focus": False,
                    "status": "submitted",
                },
                {
                    "code": "",
                    "focus": False,
                    "cellUid": "75d12e19-f0ff-4830-83ac-070d257ec322",
                    "status": "new",
                },
                {
                    "code": "b = 3",
                    "focus": False,
                    "cellUid": "30551f71-2d63-4ce5-88d8-18e2ebf7d60d",
                    "status": "submitted",
                },
                {
                    "code": "a + b",
                    "focus": True,
                    "cellUid": "9eea0176-0f76-48ec-973f-6727efe44245",
                    "status": "submitted",
                },
            ],
        }
        url = "/api/v1/{}/{}/{}/save_script".format(
            organization_slug, project_id, script_id
        )
        response = client.post(url, data=json_data, format="json")
        self.assertEqual(response.status_code, 201)

        w = Widget.objects.all()
        self.assertEqual(len(w), 2)

        url = "/api/v1/{}/{}/{}/save_script".format(
            organization_slug, project_id, script_id
        )
        response = client.post(url, data=json_data, format="json")
        self.assertEqual(response.status_code, 201)

        w = Widget.objects.all()
        self.assertEqual(len(w), 2)
