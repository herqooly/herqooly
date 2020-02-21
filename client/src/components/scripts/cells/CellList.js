import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { getCellList } from "./CellsActions";
import Cell from "./Cell";

class CellList extends Component {
  componentDidMount() {
    console.log("cell list did mount");
    this.props.getCellList(
      this.props.urlParams.organizationSlug,
      this.props.urlParams.projectId,
      this.props.urlParams.scriptId
    );
  }
  componentDidUpdate(prevProps) {}

  render() {
    const { cells } = this.props.cells;

    let cellItems = cells.map((cell, index) => {
      return (
        <Cell
          code={cell.code}
          focus={cell.focus}
          state={cell.state}
          cellUid={cell.cellUid}
          key={"Cell" + index + cell.cellUid}
          cellArrayIndex={index}
          organizationSlug={this.props.urlParams.organizationSlug}
          projectId={this.props.urlParams.projectId}
          scriptId={this.props.urlParams.scriptId}
        />
      );
    });

    return (
      <div style={{ marginTop: "10px" }}>
        {cellItems} <div style={{ height: "80px" }}></div>
      </div>
    );
  }
}

CellList.propTypes = {
  getCellList: PropTypes.func.isRequired,
  cells: PropTypes.object.isRequired
};

const mapStateToProps = (state, ownProps) => ({ cells: state.cells });

export default connect(mapStateToProps, { getCellList })(withRouter(CellList));
