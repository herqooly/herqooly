import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
//import isEmpty from "../../../validation/isEmpty";
//import { Button } from "reactstrap";
import Plot from "react-plotly.js";
import { ROW_GRID_HEIGHT } from "../Settings";

class PlotlyWidget extends Component {
  componentDidMount() {}
  componentDidUpdate(prevProps) {}

  render() {
    const { style } = this.props;
    console.log(this.props.data);
    //plot_bgcolor: "rgba(0,0,0,0)"

    console.log(this.props.layout);

    return (
      <div
        style={{
          ...style,
          height: ROW_GRID_HEIGHT * (this.props.layout.h + 2)
        }}
      >
        <Plot
          style={{ width: "100%", height: "160%" }} // I have resize problems!
          data={this.props.data.data}
          layout={{
            ...this.props.data.layout,
            autosize: true,
            paper_bgcolor: "rgba(0,0,0,0)",
            margin: { t: 40, r: 10, l: 10, b: 50 }
          }}
          useResizeHandler={true}
          config={{ editable: this.props.editable, displayModeBar: false }}
        />
      </div>
    );
  }
}

PlotlyWidget.propTypes = {
  data: PropTypes.object.isRequired,
  style: PropTypes.object.isRequired,
  layout: PropTypes.object.isRequired
};

const mapStateToProps = (state, ownProps) => ({});

export default connect(mapStateToProps, {})(withRouter(PlotlyWidget));
