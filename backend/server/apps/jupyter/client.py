import os
import requests


class JupyterClient:
    def __init__(self):
        self.jupyter_url = os.environ.get("JUPYTER_URL")
        if "localhost" not in self.jupyter_url:
            self.jupyter_url = "http://jupyter:8888"
        self.jupyter_token = os.environ.get("JUPYTER_TOKEN")
        self.headers = {"Authorization": "Token " + self.jupyter_token}

    def is_available(self):

        try:
            response = requests.get("{}{}".format(self.jupyter_url, "/api"))
            response.raise_for_status()
            return response.status_code == 200
        except Exception as e:
            print(e)

        return False

    def can_authenticate(self):

        try:
            response = requests.get(
                "{}{}".format(self.jupyter_url, "/api/kernels"), headers=self.headers
            )
            response.raise_for_status()
            return response.status_code == 200
        except Exception as e:
            print(e)

        return False

    def create_directory(self, dir_name):
        try:
            payload = {"type": "directory"}
            response = requests.put(
                "{}{}{}".format(self.jupyter_url, "/api/contents/", dir_name),
                json=payload,
                headers=self.headers,
            )
            response.raise_for_status()
            return response.status_code == 201
        except Exception as e:
            print(e)
        return False

    def create_project_directory(self, proj_slug):
        # set up the project directory structure
        dirs = [
            proj_slug,
            os.path.join(proj_slug, "src"),
            os.path.join(proj_slug, "data"),
            os.path.join(proj_slug, "data", "uploaded"),
            os.path.join(proj_slug, "data", "processed"),
            os.path.join(proj_slug, "models"),
            os.path.join(proj_slug, "reports"),
            os.path.join(proj_slug, "figures"),
        ]
        for d in dirs:
            created = self.create_directory("sandbox/" + d)
            if not created:
                return False
        return True

    def delete_project_directory(self, proj_slug):
        try:
            response = requests.delete(
                "{}{}{}".format(self.jupyter_url, "/api/contents/sandbox/", proj_slug),
                headers=self.headers,
            )
            response.raise_for_status()
            return response.status_code == 204
        except Exception as e:
            print(e)
        return False

    def get_kernels(self):
        try:
            response = requests.get(
                "{}{}".format(self.jupyter_url, "/api/kernels"), headers=self.headers,
            )
            response.raise_for_status()
            return response.json()
        except Exception as e:
            print(e)
        return None

    def start_kernel(self):
        try:
            response = requests.post(
                "{}{}".format(self.jupyter_url, "/api/kernels"), headers=self.headers,
            )
            response.raise_for_status()
            return response.json()
        except Exception as e:
            print(e)
        return None

    def shutdown_kernel(self, kernel_id):
        try:
            response = requests.delete(
                "{}{}{}".format(self.jupyter_url, "/api/kernels/", kernel_id),
                headers=self.headers,
            )
            response.raise_for_status()
            return response.status_code == 204
        except Exception as e:
            print(e)
        return None
    
    def interrupt_kernel(self, kernel_id):
        try:
            response = requests.post(
                "{}{}{}/interrupt".format(self.jupyter_url, "/api/kernels/", kernel_id),
                headers=self.headers,
            )
            response.raise_for_status()
            return response.status_code == 204
        except Exception as e:
            print(e)
        return None

    def restart_kernel(self, kernel_id):
        try:
            response = requests.post(
                "{}{}{}/restart".format(self.jupyter_url, "/api/kernels/", kernel_id),
                headers=self.headers,
            )
            response.raise_for_status()
            return response.status_code == 200
        except Exception as e:
            print(e)
        return None

    def start_session(self, path, name):
        data = {
            "kernel": {"id": None, "name": "python3" },
            "name": name,
            "path": path,
            "type": "notebook",
        }
        try:
            print("start_session", data)
            response = requests.post(
                "{}{}".format(self.jupyter_url, "/api/sessions"),
                json=data,
                headers=self.headers,
            )
            response.raise_for_status()
            return response.json()

        except Exception as e:
            print(e)
        return None

    def write_file(self, file_name, file_path, content):
        try:
            payload = {
                "type": "file",
                "content": content,
                "path": file_path + file_name,
                "format": "text",
            }
            response = requests.put(
                "{}{}{}{}".format(
                    self.jupyter_url, "/api/contents/", file_path, file_name
                ),
                json=payload,
                headers=self.headers,
            )
            response.raise_for_status()
            return response.status_code == 201
        except Exception as e:
            print(e)
        return False

    def write_jupyter_nb_file(self, file_name, file_path, jupyter_nb_code):
        try:
            payload = {
                "type": "notebook",
                "content": {
                    "cells": jupyter_nb_code,
                    "metadata": {
                        "kernelspec": {
                            "name": "python3",
                            "display_name": "python3",
                            "language": "python",
                        },
                        "language_info": {
                            "name": "python",
                            "version": "3.6.7",
                            "mimetype": "text/x-python",
                            "codemirror_mode": {"name": "ipython", "version": 3},
                            "pygments_lexer": "ipython3",
                            "nbconvert_exporter": "python",
                            "file_extension": ".py",
                        },
                    },
                    "nbformat": 4,
                    "nbformat_minor": 2,
                },
            }
            response = requests.put(
                "{}{}{}{}".format(
                    self.jupyter_url, "/api/contents/", file_path, file_name
                ),
                json=payload,
                headers=self.headers,
            )
            response.raise_for_status()
            return response.status_code == 201
        except Exception as e:
            print(e)
        return False

    def get_kernel_specs(self, kernel_name):
        try:
            response = requests.get(
                "{}{}{}".format(self.jupyter_url, "/api/kernelspecs/", kernel_name),
                headers=self.headers,
            )
            response.raise_for_status()
            return response.json()
        except Exception as e:
            print(e)
        return None

    def delete_file(self, file_path):
        try:
            response = requests.delete(
                "{}{}{}".format(self.jupyter_url, "/api/contents/", file_path),
                headers=self.headers,
            )
            response.raise_for_status()
            return response.status_code == 204
        except Exception as e:
            print(e)
        return False
