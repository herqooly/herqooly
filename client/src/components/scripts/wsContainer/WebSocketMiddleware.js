import * as webSocketsActions from "./WebSocketActions";
import {
  WEBSOCKET_CONNECT,
  WEBSOCKET_DISCONNECT,
  WEBSOCKET_SEND
} from "./WebSocketTypes";

//import { isEmpty } from "../../../utils/Common";

import { toast } from "react-toastify";

import uuid from "uuid";

import { updateWidget } from "../widgets/WidgetsActions";
import { updateCellState } from "../cells/CellsActions";

import { SET_MSG_ID_TO_CELL_ID } from "../cells/CellsTypes";
import { SET_KERNEL_EXECUTION_STATE, SET_KERNEL } from "../ScriptTypes";

export const WebSocketsMiddleware = (function() {
  let sockets = {};

  const onOpen = (ws, store, scriptId, host) => event => {
    store.dispatch(webSocketsActions.webSocketConnected(scriptId, host));
  };

  const onClose = (ws, store, host, scriptId) => event => {
    store.dispatch(webSocketsActions.webSocketDisconnected(scriptId));
    store.dispatch({
      type: SET_KERNEL,
      payload: { scriptId, kernel: { id: "", execution_state: "unknown" } }
    });
  };

  const onMessage = (ws, store, scriptId) => event => {
    try {
      let payload = JSON.parse(event.data);

      if (payload.channel === "iopub") {
        if (
          payload.msg_type === "execute_result" ||
          payload.msg_type === "display_data" ||
          payload.msg_type === "stream"
        ) {
          store.dispatch(updateWidget(payload));
        } else if (payload.msg_type === "error") {
          store.dispatch(updateWidget(payload));
        }
      }

      if (payload.msg_type === "status") {
        store.dispatch(
          updateCellState(
            payload.parent_header.msg_id,
            payload.content.execution_state
          )
        );

        store.dispatch({
          type: SET_KERNEL_EXECUTION_STATE,
          payload: {
            scriptId,
            execution_state: payload.content.execution_state
          }
        });
      }
    } catch (e) {
      console.log(e);
      console.error("Cant parse message from websocket");
    }
  };

  const onError = (ws, store, scriptId) => event => {
    console.log("WebSocket onError");
  };

  return store => next => action => {
    if (
      ![WEBSOCKET_CONNECT, WEBSOCKET_DISCONNECT, WEBSOCKET_SEND].includes(
        action.type
      ) ||
      !action.hasOwnProperty("scriptId")
    ) {
      return next(action);
    }

    const { scriptId } = action;
    let socket = sockets.hasOwnProperty(scriptId.toString())
      ? sockets[scriptId.toString()]
      : null;

    switch (action.type) {
      case WEBSOCKET_CONNECT:
        if (socket !== null) {
          socket.close();
        }

        // Pass action along
        next(action);

        socket = new WebSocket(action.host);
        socket.onmessage = onMessage(socket, store, scriptId);
        socket.onclose = onClose(socket, store, action.host, scriptId);
        socket.onopen = onOpen(socket, store, scriptId, action.host);
        socket.onerror = onError(socket, store, scriptId);

        sockets[scriptId.toString()] = socket;
        break;

      case WEBSOCKET_DISCONNECT:
        console.log("disconnected");
        if (socket !== null) {
          socket.close();
        }
        socket = null;
        // Tell the store that we've been disconnected...
        store.dispatch(webSocketsActions.webSocketDisconnected(action.host));
        break;

      case WEBSOCKET_SEND:
        let msgId = uuid.v4();

        store.dispatch({
          type: SET_MSG_ID_TO_CELL_ID,
          payload: {
            msgId: msgId,
            cellUid: action.payload.cellUid
          }
        });

        let msg_type = "execute_request";
        let content = { code: action.payload.code, silent: false };
        let hdr = {
          msg_id: msgId,
          username: "test",
          session: "123456",
          msg_type: msg_type,
          version: "5.0"
        };
        let msg = {
          header: hdr,
          parent_header: hdr,
          metadata: {},
          content: content,
          channel: "shell"
        };

        if (socket !== null) {
          socket.send(JSON.stringify(msg));
        } else {
          toast.error(
            "There is no connection to Jupyter! Please try to connect by clicking START.",
            {
              autoClose: 8000,
              hideProgressBar: true,
              newsetOnTop: true
            }
          );
        }
        break;
      default:
        return next(action);
    }
  };
})();
