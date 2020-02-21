import {
  WEBSOCKET_CONNECT,
  WEBSOCKET_CONNECTED,
  WEBSOCKET_DISCONNECTED
} from "./WebSocketTypes";

const initialState = {
  connections: {}
};

function webSocketReducer(state = initialState, action) {
  switch (action.type) {
    case WEBSOCKET_CONNECT:
    case WEBSOCKET_CONNECTED:
      state.connections[action.scriptId] = {
        host: action.host,
        status: action.type === WEBSOCKET_CONNECT ? "connecting" : "connected"
      };
      return {
        ...state,
        connections: { ...state.connections }
      };

    case WEBSOCKET_DISCONNECTED:
      state.connections[action.scriptId] = {
        ...state.connections[action.scriptId],
        status: "disconnected"
      };
      return {
        ...state,
        connections: { ...state.connections }
      };

    default:
      return state;
  }
}

export default webSocketReducer;
