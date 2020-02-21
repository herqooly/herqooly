import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
//import PropTypes from "prop-types";
import { Button } from "reactstrap";

import { showModal, hideModal } from "../../../modals/ModalActions";

class CellHeader extends Component {
  onRead = () => {
    console.log("on read");
    this.props.showModal(
      {
        open: true,
        projectId: this.props.urlParams.projectId,
        scriptId: this.props.urlParams.scriptId,
        closeModal: this.props.hideModal
      },
      "readData"
    );
  };

  onVis = () => {
    console.log("on vis");
    this.props.showModal(
      {
        open: true,
        projectId: this.props.urlParams.projectId,
        scriptId: this.props.urlParams.scriptId,
        closeModal: this.props.hideModal
      },
      "vis"
    );
  };

  onWidgetsClick = () => {
    console.log("on widgets");
    this.props.showModal(
      {
        open: true,
        projectId: this.props.urlParams.projectId,
        scriptId: this.props.urlParams.scriptId,
        closeModal: this.props.hideModal
      },
      "widgets"
    );
  };

  render() {
    //this.onVis();
    let editorBorderColor = "#3498db";
    let header = "";

    if (this.props.focus) {
      header = (
        <div
          style={{
            backgroundColor: "#3498db",
            border: "3px solid " + editorBorderColor
          }}
        >
          <Button
            className="menu-button"
            outlined="true"
            onClick={this.onRead}
            size="sm"
          >
            <i className="fa fa-download" aria-hidden="true" /> Read
          </Button>

          <Button
            className="menu-button"
            outlined="true"
            size="sm"
            onClick={this.onVis}
          >
            <i className="fa fa-bar-chart" aria-hidden="true" /> Explore
          </Button>
          {/*<Button className="menu-button" outlined="true" size="sm">
            <i className="fa fa-cogs" aria-hidden="true" /> Prepare
        </Button>*/}
          <Button
            className="menu-button"
            outlined="true"
            size="sm"
            onClick={this.onWidgetsClick}
          >
            <i className="fa fa-sliders" aria-hidden="true" /> Widgets
          </Button>
          {/*<Button className="menu-button" outlined="true" size="sm">
            <i className="fa fa-flask" aria-hidden="true" /> ML
          </Button>
          <Button className="menu-button" outlined="true" size="sm">
            <i className="fa fa-upload" aria-hidden="true" /> Export
      </Button>*/}
        </div>
      );
    }

    return <div>{header}</div>;
  }
}

CellHeader.propTypes = {};

const mapStateToProps = (state, ownProps) => ({
  urlParams: ownProps.match.params
});

export default connect(mapStateToProps, { showModal, hideModal })(
  withRouter(CellHeader)
);
