import React, { Component } from "react";
import { connect } from "react-redux";
import { webSocketConnect, webSocketDisconnect } from "./WebSocketActions";
import PropTypes from "prop-types";

class WebSocketContainer extends Component {
  constructor(props) {
    super(props);
    this.autoconnect = !!props.autoconnect;
  }

  componentDidMount() {
    const { jupyter } = this.props.auth;
    const scriptId = this.props.script.id;
    const { connections } = this.props.webSocket;

    let status =
      scriptId.toString() in connections
        ? connections[scriptId.toString()].status
        : "unknown";
    const { id } = this.props.kernels[scriptId];

    let wsUrl =
      "ws://" +
      jupyter.token +
      "@" +
      jupyter.ws +
      "/api/kernels/" +
      id +
      "/channels?session_id=123456&token=" +
      jupyter.token;

    if (status !== "connected") {
      this.props.webSocketConnect(scriptId, wsUrl);
    }
  }

  componentWillUnmount() {}

  render() {
    return <div>{this.props.children}</div>;
  }
}

WebSocketContainer.propTypes = {
  auth: PropTypes.object.isRequired,
  webSocket: PropTypes.object.isRequired,
  kernels: PropTypes.object.isRequired,
  script: PropTypes.object.isRequired
};

const mapStateToProps = (state, ownProps) => ({
  auth: state.auth,
  webSocket: state.ws,
  kernels: state.scripts.kernels,
  script: state.scripts.script
});

const mapDispatchToProps = {
  webSocketConnect
};

export default connect(mapStateToProps, mapDispatchToProps)(WebSocketContainer);
