import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
//import isEmpty from "../../../validation/isEmpty";
//import { Button } from "reactstrap";

class ErrorWidget extends Component {
  componentDidMount() {}
  componentDidUpdate(prevProps) {}

  render() {
    const { text } = this.props.data;
    const { reason } = this.props.data;
    const { style } = this.props;

    return (
      <div style={{ ...style, backgroundColor: "#ffcccc" }}>
        <h4>Error</h4>
        <h6>{reason}</h6>
        <pre>{text}</pre>
      </div>
    );
  }
}

ErrorWidget.propTypes = {
  data: PropTypes.object.isRequired,
  style: PropTypes.object.isRequired
};

const mapStateToProps = (state, ownProps) => ({});

export default connect(mapStateToProps, {})(withRouter(ErrorWidget));
