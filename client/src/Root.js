import React from "react";
import thunk from "redux-thunk";

import { Provider } from "react-redux";
import { applyMiddleware, createStore } from "redux";
import { routerMiddleware, ConnectedRouter } from "connected-react-router";
import { createBrowserHistory } from "history";
import { composeWithDevTools } from "redux-devtools-extension/developmentOnly";

import {
  setCurrentUser,
  setToken,
  setAxiosAuthToken
} from "./auth/AuthActions";

import rootReducer from "./Reducer";

import { WebSocketsMiddleware } from "./components/scripts/wsContainer/WebSocketMiddleware";

export default ({ children, initialState = {} }) => {
  const middleware = [thunk, WebSocketsMiddleware];
  const history = createBrowserHistory();

  const store = createStore(
    rootReducer(history),
    initialState,
    composeWithDevTools(
      applyMiddleware(routerMiddleware(history), ...middleware)
    )
  );

  if (localStorage.token) {
    setAxiosAuthToken(localStorage.token);
    const user = JSON.parse(localStorage.getItem("user"));
    const organization = JSON.parse(localStorage.getItem("organization"));
    store.dispatch(setToken(localStorage.token));
    store.dispatch(setCurrentUser(user, organization, ""));
  }

  return (
    <Provider store={store}>
      <ConnectedRouter history={history}>{children}</ConnectedRouter>
    </Provider>
  );
};
