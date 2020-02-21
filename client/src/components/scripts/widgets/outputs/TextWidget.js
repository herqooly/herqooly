import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
//import isEmpty from "../../../validation/isEmpty";
//import { Button } from "reactstrap";

class TextWidget extends Component {
  componentDidMount() {}
  componentDidUpdate(prevProps) {}

  render() {
    const { text } = this.props.data;
    const { style } = this.props;

    return (
      <div style={style}>
        <pre>{text}</pre>
      </div>
    );
  }
}

TextWidget.propTypes = {
  data: PropTypes.object.isRequired,
  style: PropTypes.object.isRequired
};

const mapStateToProps = (state, ownProps) => ({});

export default connect(mapStateToProps, {})(withRouter(TextWidget));
