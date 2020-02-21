import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Row, Col } from "reactstrap";
import { getScript, deleteScript } from "./ScriptActions";
import { getProjectDetail } from "../projects/ProjectActions";

import CellList from "./cells/CellList";
import ScriptMenu from "./ScriptMenu";
import WidgetsView from "./widgets/WidgetsView";

class ScriptView extends Component {
  componentDidMount() {
    this.props.getProjectDetail(
      this.props.urlParams.organizationSlug,
      this.props.urlParams.projectId
    );

    this.props.getScript(
      this.props.urlParams.organizationSlug,
      this.props.urlParams.projectId,
      this.props.urlParams.scriptId
    );
  }

  deleteScript = () => {
    this.props.deleteScript(
      this.props.urlParams.organizationSlug,
      this.props.urlParams.projectId,
      this.props.urlParams.scriptId
    );
  };

  render() {
    //<div style={{ backgroundColor: "green" }}>widgets</div>
    return (
      <div className="container-fluid">
        <ScriptMenu {...this.props} />
        <Row>
          <Col md={5} style={{ paddingRight: "0px" }}>
            <CellList {...this.props} />
          </Col>
          <Col
            md={7}
            style={{
              paddingLeft: "5px",
              paddingRight: "0px"
            }}
          >
            <WidgetsView {...this.props} />
          </Col>
        </Row>
      </div>
    );
  }
}

ScriptView.propTypes = {
  urlParams: PropTypes.object.isRequired,
  getScript: PropTypes.func.isRequired,
  script: PropTypes.object.isRequired,
  deleteScript: PropTypes.func.isRequired,
  getProjectDetail: PropTypes.func.isRequired
};

const mapStateToProps = (state, ownProps) => ({
  urlParams: ownProps.match.params,
  script: state.scripts.script
});

export default connect(mapStateToProps, {
  getScript,
  deleteScript,
  getProjectDetail
})(withRouter(ScriptView));
