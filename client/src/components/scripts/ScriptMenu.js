import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Button, Row } from "reactstrap";
import {
  getScript,
  deleteScript,
  startKernel,
  saveScript,
  getLinks,
  interruptKernel,
  restartKernel,
  onQueue
} from "./ScriptActions";
import { executeAllCells } from "./cells/CellsActions";
import WebSocketContainer from "./wsContainer/WebSocketContainer";
import { isEmpty } from "../../utils/Common";
import { showModal, hideModal } from "../../modals/ModalActions";
import classnames from "classnames";

import { getSecrets } from "../secrets/SecretActions";

class ScriptMenu extends Component {
  componentDidMount() {
    this.props.getScript(
      this.props.urlParams.organizationSlug,
      this.props.urlParams.projectId,
      this.props.urlParams.scriptId
    );

    this.props.getSecrets(
      this.props.urlParams.organizationSlug,
      this.props.urlParams.projectId
    );

    this.onStartClick();

    //this.saveScriptInterval = setInterval(
    //  () => this.onSaveScript(false),
    //  5 * 60000
    //); // 5*60 seconds
  }

  componentWillUnmount() {
    //clearInterval(this.saveScriptInterval);
    //this.onSaveScript(false);
  }

  onDeleteScript = () => {
    this.props.deleteScript(
      this.props.urlParams.organizationSlug,
      this.props.urlParams.projectId,
      this.props.urlParams.scriptId
    );
  };

  onSaveScript = (showNotification = true) => {
    this.props.saveScript(
      this.props.urlParams.organizationSlug,
      this.props.urlParams.projectId,
      this.props.urlParams.scriptId,
      showNotification
    );
  };

  onStopComputing = () => {
    this.props.interruptKernel(
      this.props.urlParams.organizationSlug,
      this.props.urlParams.projectId,
      this.props.urlParams.scriptId
    );
  };

  onRestartKernel = () => {
    this.props.restartKernel(
      this.props.urlParams.organizationSlug,
      this.props.urlParams.projectId,
      this.props.urlParams.scriptId
    );
  };

  onQueue = () => {
    this.props.onQueue(this.props.urlParams.scriptId);
  };

  onShareScript = () => {
    console.log("share");
    this.props.getLinks(this.props.urlParams.scriptId);
    this.props.showModal(
      {
        open: true,
        organizationSlug: this.props.urlParams.organizationSlug,
        projectId: this.props.urlParams.projectId,
        scriptId: this.props.urlParams.scriptId,
        closeModal: this.props.hideModal
      },
      "shareApp"
    );
  };

  onStartClick = () => {
    this.props.startKernel(
      this.props.urlParams.organizationSlug,
      this.props.urlParams.projectId,
      this.props.urlParams.scriptId
    );
  };

  render() {
    if (isEmpty(this.props.script)) {
      return "Loading the script ...";
    }
    const { title } = this.props.script;
    //const { slug } = this.props.script;
    const scriptId = this.props.script.id;

    let wsContainer = "";
    let kernelInfo = "";
    let kernelState = "";
    if (
      this.props.kernels.hasOwnProperty(scriptId) &&
      !isEmpty(this.props.kernels[scriptId].id)
    ) {
      wsContainer = (
        <WebSocketContainer autoconnect={false}></WebSocketContainer>
      );

      kernelInfo =
        this.props.kernels[scriptId].id +
        " " +
        this.props.kernels[scriptId].execution_state;
      kernelState = this.props.kernels[scriptId].execution_state;
    }

    const { connections } = this.props.webSocket;
    const { status, host } =
      scriptId.toString() in connections
        ? connections[scriptId.toString()]
        : { status: "unknown", host: "unknown" };

    return (
      <Row>
        <div style={{ paddingLeft: "16px" }}>
          {kernelInfo === "" && (
            <Button
              color="primary"
              outline
              size="sm"
              onClick={this.onStartClick}
            >
              <i className="fa fa-bolt" aria-hidden="true" /> Start
            </Button>
          )}{" "}
          <Button
            color="primary"
            outline
            size="sm"
            onClick={() => {
              this.props.executeAllCells(scriptId);
            }}
          >
            <i className="fa fa-play" aria-hidden="true" /> Run All
          </Button>{" "}
          <Button
            color="primary"
            outline
            size="sm"
            onClick={this.onStopComputing}
          >
            <i className="fa fa-stop" aria-hidden="true" /> Stop computing
          </Button>{" "}
          <Button
            color="primary"
            outline
            size="sm"
            onClick={this.onRestartKernel}
          >
            <i className="fa fa-refresh" aria-hidden="true" /> Restart computing
          </Button>{" "}
          {" | "}
          <Button color="primary" outline size="sm" onClick={this.onSaveScript}>
            <i className="fa fa-save" aria-hidden="true" /> Save
          </Button>{" "}
          <Button
            color="primary"
            outline
            size="sm"
            onClick={this.onDeleteScript}
          >
            <i className="fa fa-trash" aria-hidden="true" /> Delete
          </Button>
          {" | "}
          <Button
            color="primary"
            outline
            size="sm"
            onClick={this.onShareScript}
          >
            <i className="fa fa-share-alt" aria-hidden="true" /> Share
          </Button>{" "}
          <Button color="primary" outline size="sm" onClick={this.onQueue}>
            Queue
          </Button>
          {" | "}
          <b>Script: {title} </b>
          {" | "}
          Kernel:
          <span
            className={classnames(
              "badge",
              { "badge-success": kernelState === "idle" },
              { "badge-warning": kernelState === "busy" }
            )}
          >
            {kernelState}
          </span>
          {" | "}
          WebSocket:
          <span
            className={classnames(
              "badge",
              { "badge-success": status === "connected" },
              { "badge-danger": status === "disconnected" }
            )}
          >
            {status}
          </span>
          {wsContainer}
        </div>
      </Row>
    );
  }
}

ScriptMenu.propTypes = {
  urlParams: PropTypes.object.isRequired,
  getScript: PropTypes.func.isRequired,
  script: PropTypes.object.isRequired,
  deleteScript: PropTypes.func.isRequired,
  saveScript: PropTypes.func.isRequired,
  startKernel: PropTypes.func.isRequired,
  kernels: PropTypes.object.isRequired,
  getLinks: PropTypes.func.isRequired,
  webSocket: PropTypes.object.isRequired
};

const mapStateToProps = (state, ownProps) => ({
  urlParams: ownProps.match.params,
  script: state.scripts.script,
  kernels: state.scripts.kernels,
  scripts: state.scripts,
  webSocket: state.ws
});

export default connect(mapStateToProps, {
  showModal,
  hideModal,
  getScript,
  deleteScript,
  startKernel,
  saveScript,
  getLinks,
  interruptKernel,
  restartKernel,
  executeAllCells,
  onQueue,
  getSecrets
})(withRouter(ScriptMenu));
