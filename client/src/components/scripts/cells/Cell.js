import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { Controlled as CodeMirror } from "react-codemirror2";

import "codemirror/theme/neat.css";
import "codemirror/mode/python/python.js";

import { updateCellCode, setFocus } from "./CellsActions";
import CellHeader from "./CellHeader";
import CellFooter from "./CellFooter";
import { isEmpty } from "../../../utils/Common";

import { addCell, executeCell, setFocusOrAddNewCell } from "./CellsActions";

class Cell extends Component {
  constructor(props) {
    super(props);
    this.instance = null;
  }
  componentDidMount() {}

  onEditorFocus = e => {
    this.props.setFocus(this.props.cellArrayIndex);
  };
  onEditorBlur = e => {};

  onEditorChange(value) {
    this.props.updateCellCode(this.props.cellArrayIndex, value);
  }

  checkTheFocus = () => {
    if (this.props.focus && !isEmpty(this.instance)) {
      this.instance.focus();
    }
  };

  render() {
    let focusClassName = "cell-default";
    if (this.props.focus) {
      focusClassName =
        this.props.state === "busy" ? "cell-focus-busy" : "cell-focus-idle";
    } else {
      focusClassName =
        this.props.state === "busy" ? "cell-focus-busy" : "cell-default";
    }

    if (this.props.state === "submitted") {
      focusClassName = "cell-submitted";
    }

    this.checkTheFocus();
    /**style={{
          backgroundColor: "transparent",
          marginTop: "-1px"
        }} */
    return (
      <div className={focusClassName}>
        <CellHeader
          focus={this.props.focus}
          cellArrayIndex={this.props.cellArrayIndex}
          {...this.props}
        />
        <CodeMirror
          value={this.props.code}
          options={{
            mode: "python",
            theme: "neat",
            lineNumbers: false,
            extraKeys: { "Shift-Enter": cm => {} }
          }}
          editorDidMount={editor => {
            this.instance = editor;
            this.checkTheFocus();
          }}
          onBeforeChange={(editor, data, value) => {
            this.onEditorChange(value);
            //this.setState({value});
          }}
          onKeyDown={(e, v) => {
            //console.log(e);

            if (["ArrowUp", "ArrowDown"].includes(v.key)) {
              const pos = this.instance.getCursor();

              // console.log(v);
              // console.log(pos);
              // console.log(this.props.code.length);
              // console.log(pos.hitSide);
              if (this.props.code.length === 0) {
                if (v.key === "ArrowUp") {
                  this.props.setFocus(this.props.cellArrayIndex - 1);
                } else if (v.key === "ArrowDown") {
                  this.props.setFocus(this.props.cellArrayIndex + 1);
                }
              } else {
                if (pos.hitSide) {
                  if (pos.outside === -1 && v.key === "ArrowUp") {
                    this.props.setFocus(this.props.cellArrayIndex - 1);
                  } else if (pos.outside === 1 && v.key === "ArrowDown") {
                    this.props.setFocus(this.props.cellArrayIndex + 1);
                  }
                }
              }
            } else if (v.key === "Enter") {
              if (v.altKey) {
                //console.log("with alt");

                this.props.executeCell(
                  this.props.scriptId,
                  this.props.cellArrayIndex,
                  this.props.cellUid
                );
                this.props.addCell(this.props.cellArrayIndex);
              } else if (v.ctrlKey) {
                // execute current cell
                this.props.executeCell(
                  this.props.scriptId,
                  this.props.cellArrayIndex,
                  this.props.cellUid
                );
              } else if (v.shiftKey) {
                //console.log("with shift");
                this.props.executeCell(
                  this.props.scriptId,
                  this.props.cellArrayIndex,
                  this.props.cellUid
                );
                this.props.setFocusOrAddNewCell(this.props.cellArrayIndex + 1);
              }
            }
          }}
          onFocus={this.onEditorFocus}
          onBlur={this.onEditorBlur}
        />
        <CellFooter
          focus={this.props.focus}
          cellArrayIndex={this.props.cellArrayIndex}
          cellUid={this.props.cellUid}
          scriptId={this.props.scriptId}
        />
      </div>
    );
  }
}

Cell.propTypes = {
  updateCellCode: PropTypes.func.isRequired,
  setFocus: PropTypes.func.isRequired
};

const mapStateToProps = (state, ownProps) => ({});

export default connect(mapStateToProps, {
  updateCellCode,
  setFocus,
  executeCell,
  addCell,
  setFocusOrAddNewCell
})(withRouter(Cell));
