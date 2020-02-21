import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { getProjectDetail } from "../projects/ProjectActions";

import { getScripts } from "./ScriptActions";
import { isEmpty } from "../../utils/Common";

//import { showModal, hideModal } from "../modals/ModalActions";
import { Row } from "reactstrap";
import EmptyScriptsView from "./EmptyScriptsView";

class ScriptListView extends Component {
  componentDidMount() {
    if (isEmpty(this.props.project)) {
      this.props.getProjectDetail(
        this.props.urlParams.organizationSlug,
        this.props.urlParams.projectId
      );
    }

    this.props.getScripts(
      this.props.urlParams.organizationSlug,
      this.props.urlParams.projectId
    );
  }

  render() {
    const { scripts } = this.props.scripts;

    if (isEmpty(scripts)) {
      return <EmptyScriptsView {...this.props} />;
    }

    return (
      <div className="container-fluid">
        <Row>Loading ...</Row>
      </div>
    );
  }
}

ScriptListView.propTypes = {
  urlParams: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  project: PropTypes.object.isRequired,
  getProjectDetail: PropTypes.func.isRequired,
  getScripts: PropTypes.func.isRequired,
  scripts: PropTypes.object.isRequired
};

const mapStateToProps = (state, ownProps) => ({
  urlParams: ownProps.match.params,
  //projectDetail: state.projectDetail,
  //prediction: state.prediction,
  //organization_slug: ownProps.match.params,
  //project_id: ownProps.match.params,

  auth: state.auth,
  project: state.projects.project,
  scripts: state.scripts
  //webSocket: state.webSocket
});

export default connect(mapStateToProps, {
  getProjectDetail,
  getScripts
  // showModal, hideModal
})(withRouter(ScriptListView));
