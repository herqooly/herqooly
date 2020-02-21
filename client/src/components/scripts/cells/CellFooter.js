import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { Button } from "reactstrap";
import { deleteCell, addCell, executeCell } from "./CellsActions";

class CellFooter extends Component {
  onDeleteCell = () => {
    this.props.deleteCell(this.props.cellArrayIndex);
  };

  onAddCell = () => {
    this.props.addCell(this.props.cellArrayIndex);
  };

  onRun = () => {
    this.props.executeCell(
      this.props.scriptId,
      this.props.cellArrayIndex,
      this.props.cellUid
    );
  };

  render() {
    //let editorBorderColor = "#3498db";
    let footer = ""; //<div>"cellArrayIndex" {this.props.cellArrayIndex}</div>;

    if (this.props.focus) {
      footer = (
        <div
          style={{
            marginBottom: "5px",
            backgroundColor: "#eff2f5",
            padding: "2px"
          }}
        >
          <div>
            <Button
              style={{
                backgroundColor: "transparent",
                color: "#21bb5f",
                border: "1px"
              }}
              onClick={this.onAddCell}
              size="sm"
            >
              <i className="fa fa-plus" aria-hidden="true" /> Add cell
            </Button>
            <Button
              style={{
                backgroundColor: "transparent",
                color: "#CF334B",
                border: "0px"
              }}
              onClick={this.onDeleteCell}
              size="sm"
            >
              <i className="fa fa-trash-o" aria-hidden="true" /> Delete cell
            </Button>

            <Button
              style={{
                backgroundColor: "transparent",
                color: "#21bb5f",
                border: "0px",
                float: "right"
              }}
              size="sm"
              onClick={this.onRun}
            >
              <i className="fa fa-play" aria-hidden="true" /> Run
            </Button>
          </div>
        </div>
      );
    }

    return <div>{footer}</div>;
  }
}

CellFooter.propTypes = {
  deleteCell: PropTypes.func.isRequired,
  addCell: PropTypes.func.isRequired,
  executeCell: PropTypes.func.isRequired
  //cells: PropTypes.object.isRequired
  //kernels: PropTypes.object.isRequired
};

const mapStateToProps = (state, ownProps) => ({
  //cells: state.cells
  //kernels: state.scripts
});

export default connect(mapStateToProps, { addCell, deleteCell, executeCell })(
  withRouter(CellFooter)
);
