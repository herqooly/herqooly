import React, { Component } from "react";
import { Route } from "react-router";
import SharedView from "./components/share/SharedView";

class AppShareView extends Component {
  render() {
    return <Route path="/share/:shareUid/" component={SharedView} />;
  }
}

export default AppShareView;
