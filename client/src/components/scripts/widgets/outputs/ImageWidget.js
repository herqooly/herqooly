import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { ROW_GRID_HEIGHT } from "../Settings";

class ImageWidget extends Component {
  componentDidMount() {}
  componentDidUpdate(prevProps) {}

  render() {
    const { data, mediaType } = this.props.data;

    const { style } = this.props;

    return (
      <div
        style={{
          ...style
        }}
      >
        <img
          alt=""
          src={`data:${mediaType};base64,${data}`}
          style={{ width: "97%" }}
        />
      </div>
    );
  }
}
//style={{ display: "block" }}
//, maxWidth: "100%"
ImageWidget.propTypes = {
  data: PropTypes.object.isRequired,
  style: PropTypes.object.isRequired
};

const mapStateToProps = (state, ownProps) => ({});

export default connect(mapStateToProps, {})(withRouter(ImageWidget));
