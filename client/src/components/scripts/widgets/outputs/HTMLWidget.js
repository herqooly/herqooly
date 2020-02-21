import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";

class HTMLWidget extends Component {
  componentDidMount() {}
  componentDidUpdate(prevProps) {}

  render() {
    const { text } = this.props.data;
    const { style } = this.props;

    return (
      <div style={style}>
        <div dangerouslySetInnerHTML={{ __html: text }} />
      </div>
    );
  }
}

HTMLWidget.propTypes = {
  data: PropTypes.object.isRequired,
  style: PropTypes.object.isRequired
};

const mapStateToProps = (state, ownProps) => ({});

export default connect(mapStateToProps, {})(withRouter(HTMLWidget));
