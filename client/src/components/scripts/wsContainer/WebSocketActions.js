import {
  WEBSOCKET_CONNECT,
  WEBSOCKET_CONNECTED,
  WEBSOCKET_DISCONNECT,
  WEBSOCKET_DISCONNECTED,
  WEBSOCKET_SEND
} from "./WebSocketTypes";

/****************************************************/
export const webSocketConnect = (scriptId, host) => {
  return { type: WEBSOCKET_CONNECT, scriptId, host };
};
export const webSocketConnected = (scriptId, host) => {
  return { type: WEBSOCKET_CONNECTED, scriptId, host };
};
/****************************************************/
export const webSocketDisconnect = host => {
  return { type: WEBSOCKET_DISCONNECT, host };
};
export const webSocketDisconnected = scriptId => {
  return { type: WEBSOCKET_DISCONNECTED, scriptId };
};
/****************************************************/
export const webSocketSend = (scriptId, payload) => {
  return { type: WEBSOCKET_SEND, scriptId, payload };
};
