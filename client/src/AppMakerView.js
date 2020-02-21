import React, { Component } from "react";
import { Route, Switch } from "react-router";

import NavbarMain from "./components/layout/NavbarMain";
import FooterMain from "./components/layout/FooterMain";
import LayoutWithLeftNavbar from "./components/layout/LayoutWithLeftNavbar";

import requireServerConnection from "./auth/RequireConnection";

import Home from "./components/views/Home";
import NotFoundView from "./components/views/NotFound";

import ProjectList from "./components/projects/ProjectList";
import ProjectView from "./components/projects/ProjectView";
import ScriptListView from "./components/scripts/ScriptListView";
import ScriptView from "./components/scripts/ScriptView";
import FileUploadListView from "./components/fileUpload/FileUploadListView";
class AppMakerView extends Component {
  render() {
    return (
      <div style={{ padding: "0px" }}>
        <NavbarMain />

        <Switch>
          <Route exact path="/" component={requireServerConnection(Home)} />

          <Route
            exact
            path="/:organizationSlug/projects/"
            component={requireServerConnection(ProjectList)}
          />
          <LayoutWithLeftNavbar>
            <Switch>
              <Route
                exact
                path="/:organizationSlug/project/:projectId/"
                component={requireServerConnection(ProjectView)}
              />
              <Route
                exact
                path="/:organizationSlug/project/:projectId/src"
                component={requireServerConnection(ScriptListView)}
              />
              <Route
                exact
                path="/:organizationSlug/project/:projectId/src/:scriptId"
                component={requireServerConnection(ScriptView)}
              />
              <Route
                exact
                path="/:organizationSlug/project/:projectId/uploaded"
                component={requireServerConnection(FileUploadListView)}
              />
              <Route path="*" component={NotFoundView} />
            </Switch>
          </LayoutWithLeftNavbar>
        </Switch>

        <FooterMain />
      </div>
    );
  }
}

export default AppMakerView;
