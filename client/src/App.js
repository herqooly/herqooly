import React, { Component } from "react";
import { Route, Switch } from "react-router";
import axios from "axios";

import Root from "./Root";

import ModalRoot from "./modals/ModalRoot";
import { ToastContainer } from "react-toastify";
import AppShareView from "./AppShareView";
import AppMakerView from "./AppMakerView";

axios.defaults.baseURL = "http://" + window.location.hostname + ":8003";
//process.env.REACT_APP_MLJAR_URL;
axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFToken";

console.log("AXIOS");
console.log(axios.defaults.baseURL);

class App extends Component {
  render() {
    return (
      <Root>
        <div className="App">
          <ModalRoot />
          <ToastContainer />
          <Switch>
            <Route path="/share/" component={AppShareView} />
            <Route path="/" component={AppMakerView} />
          </Switch>
        </div>
      </Root>
    );
  }
}

export default App;
