import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import JSONTree from "react-json-tree";

class JSONWidget extends Component {
  componentDidMount() {}
  componentDidUpdate(prevProps) {}

  render() {
    const theme = {
      base00: "#fafbfc",
      base01: "#073642",
      base02: "#586e75",
      base03: "#657b83",
      base04: "#839496",
      base05: "#93a1a1",
      base06: "#eee8d5",
      base07: "#fdf6e3",
      base08: "#dc322f",
      base09: "#cb4b16",
      base0A: "#b58900",
      base0B: "#66BB6A",
      base0C: "#2aa198",
      base0D: "#268bd2",
      base0E: "#6c71c4",
      base0F: "#d33682"
    };

    const { json } = this.props.data;
    const { style } = this.props;

    return (
      <div style={style}>
        <JSONTree
          data={json}
          theme={theme}
          invertTheme={false}
          keyPath={["ksiezniczka"]}
        />
      </div>
    );
  }
}

JSONWidget.propTypes = {
  data: PropTypes.object.isRequired,
  style: PropTypes.object.isRequired
};

const mapStateToProps = (state, ownProps) => ({});

export default connect(mapStateToProps, {})(withRouter(JSONWidget));
