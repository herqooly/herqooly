import os
import sys

BACKEND_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, BACKEND_DIR)
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "server.settings")
import django

django.setup()

from apps.projects.models import (
    Script,
    Widget,
)
import json

import websocket

try:
    import thread
except ImportError:
    import _thread as thread
import time

import uuid

from apps.jupyter.client import JupyterClient
import datetime
from django.core.exceptions import ObjectDoesNotExist


class Runner(object):
    def __init__(self, script_id):
        self.script_id = script_id
        self.last_msg_id = None
        self.msg_id_2_cell_uid = {}
        self.session_id = uuid.uuid1().hex
        try:
            self.script = Script.objects.get(pk=self.script_id)
            self.cells = json.loads(self.script.code)
        except ObjectDoesNotExist as e:
            raise Exception("Script with id = {} does not exist.".format(script_id))
        widgets_objs = Widget.objects.filter(parent_script__id=self.script_id)
        self.widgets = {w.widgetUid: w for w in widgets_objs}
        

    def update_widget(self, payload):
        print("Update widget")
        if payload["parent_header"]["msg_id"] not in self.msg_id_2_cell_uid:
            print("No such cell uid")
            return
        cell_uid = self.msg_id_2_cell_uid[payload["parent_header"]["msg_id"]]
        if cell_uid not in self.widgets:
            print("No such widget")
            return
        w = self.widgets[cell_uid]
        if payload["msg_type"] == "stream":
            old_data = json.loads(w.data)
            w.data = json.dumps({"text": old_data["text"] + payload["content"]["text"]})
            w.save()
        elif payload["msg_type"] in ["execute_result", "display_data"]:
            if "application/vnd.plotly.v1+json" in payload["content"]["data"]:
                w.widget_type = "plotly_widget"
                w.data = json.dumps(payload["content"]["data"]["application/vnd.plotly.v1+json"])
                w.save()
            elif "application/json" in payload["content"]["data"]:
                w.widget_type = "json_widget"
                w.data = json.dumps({"text": payload["content"]["data"]["application/json"]})
                w.save()
            elif "image/png" in payload["content"]["data"]:
                w.widget_type = "image_widget"
                w.data = json.dumps({"data":payload["content"]["data"]["image/png"], "mediaType": "image/png"})
                w.save()
            elif "text/html" in payload["content"]["data"]:
                w.widget_type = "html_widget"
                w.data = json.dumps({"text": payload["content"]["data"]["text/html"]})
                w.save()
            elif "text/plain" in payload["content"]["data"]:
                w.widget_type = "text_widget"
                w.data = json.dumps({"text": payload["content"]["data"]["text/plain"]})
                w.save()
        elif payload["msg_type"] == "error":
            w.widget_type = "error_widget"
            w.data = json.dumps({"text": payload["content"]["evalue"],
                        "reason": payload["content"]["ename"]})
            w.save()
        print("Updated.")

    def clear_widget(self, cell_uid):
        if cell_uid in self.widgets:
            w = self.widgets[cell_uid]
            if w.widget_type == "text_widget":
                w.data = json.dumps({"text": ""})
                w.save()
            

    def prepare_execute_request(self, code):
        content = {"code": code, "silent": False}
        hdr = {
            "msg_id": uuid.uuid1().hex,
            "username": "test",
            "session": self.session_id,
            "msg_type": "execute_request",
            "version": "5.0",
        }
        msg = {
            "header": hdr,
            "parent_header": hdr,
            "metadata": {},
            "content": content,
            "channel": "shell",
        }
        return msg

    def on_open(self, ws):
        print("### OPEN ###")
        def run(*args):
            for i, cell in enumerate(self.cells):
                print("-" * 33)
                print(cell["code"])
                msg = self.prepare_execute_request(cell["code"])
                if i == len(self.cells) - 1:
                    self.last_msg_id = msg["header"][
                        "msg_id"
                    ]  # needed to quit connection
                self.msg_id_2_cell_uid[msg["header"]["msg_id"]] = cell["cellUid"]
                
                self.clear_widget(cell["cellUid"])    
                ws.send(json.dumps(msg))

        thread.start_new_thread(run, ())

    def on_message(self, ws, message):
        
        payload = json.loads(message)
        if payload["channel"] == "iopub":
            if payload["msg_type"] in [
                "execute_result",
                "display_data",
                "stream",
                "error",
            ]:
                self.update_widget(payload)

        if payload["msg_type"] == "status":
            print("### STATUS", payload["content"]["execution_state"])
            if (
                payload["parent_header"]["msg_id"] == self.last_msg_id
                and payload["content"]["execution_state"] == "idle"
            ):
                print("### STOP ###")
                ws.close()

    def on_error(self, ws, error):
        print("### ERROR ###")
        print(error)

    def on_close(self, ws):
        print("### Closed ###")



def go_runner(script_id):

    try:
        runner = Runner(script_id)


        script_path = "sandbox/" + runner.script.parent_project.slug + "/src"
        script_name = runner.script.slug + ".ipynb"
        script_path += "/" + script_name
        jc = JupyterClient()
        j_session = JupyterClient().start_session(path=script_path, name=script_name)
        kernel = j_session["kernel"]

        connection_url = "{}/api/kernels/{}/channels?session_id={}".format(
            os.environ["JUPYTER_WS_URL"], kernel["id"], runner.session_id
        )
        headers = {"Authorization": "Token " + os.environ["JUPYTER_TOKEN"]}

        print(connection_url)

        #websocket.enableTrace(True)
        ws = websocket.WebSocketApp(
            connection_url,
            header=headers,
            on_message=lambda ws, msg: runner.on_message(ws, msg),
            on_error=lambda ws, error: runner.on_error(ws, error),
            on_close=lambda ws: runner.on_close(ws),
            on_open=lambda ws: runner.on_open(ws),
        )

        ws.run_forever()

        jc.shutdown_kernel(kernel["id"])
    except Exception as e:
        raise Exception("Exception during executing script (id={}), details: {}".format(script_id, str(e)))

if __name__ == "__main__":
    print("Main runner here ...")

    go_runner(3)