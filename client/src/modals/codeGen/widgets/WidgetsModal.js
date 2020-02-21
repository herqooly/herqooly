import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { Input } from "reactstrap";

import { Row, Col } from "reactstrap";

import { isEmpty } from "../../../utils/Common";

import { Controlled as CodeMirror } from "react-codemirror2";

import "codemirror/theme/neat.css";
import "codemirror/mode/python/python.js";

import {
  addToScript,
  getDataColumns
} from "../../../components/scripts/cells/CellsActions";

import Select from "react-select";

class WidgetsModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedSource: "",
      values: {},
      code: ""
    };
    this.onChange = this.onChange.bind(this);
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
    this.setState({
      errorMessage: ""
    });
  }

  componentDidMount() {
    this.props.getDataColumns(this.props.scriptId);
  }

  onAddToScript() {
    this.props.addToScript(
      this.props.scriptId,
      this.state.code,
      this.state.selectedSource.requirements.code
    );
    this.props.closeModal();
  }

  selectSource = source => {
    this.setState({
      selectedSource: source
    });
    let newValues = {};
    Object.values(source.input).forEach(i => (newValues[i.name] = i.value));
    this.setState({
      values: newValues
    });
    this.setState({
      code: source.code
    });
  };

  dataSources = () => {
    const sources = [
      {
        name: "header_widget",
        text: "Heading",
        description: "Add heading",
        input: {
          title: {
            name: "title",
            optionName: "Heading",
            type: "textInput",
            description: "Heading text",
            value: ""
          }
        },
        code:
          '# required import\nfrom IPython.core.display import display, HTML\n\
# display heading\n\
display(HTML("<h1>{{title}}</h1>"))\n',
        requirements: {
          code:
            "# required import\nfrom IPython.core.display import display, HTML\n",
          description: "display and HTML from IPython are required"
        },
        disabled: false
      },
      {
        name: "text_widget",
        text: "Text",
        description: "Add text",
        input: {
          text: {
            name: "text",
            optionName: "Heading",
            type: "textAreaInput",
            description: "Text",
            value: ""
          }
        },
        code:
          '# required import\nfrom IPython.core.display import display, HTML\n\
# display heading\n\
display(HTML("""<pre>{{text}}</pre>"""))',
        requirements: {
          code:
            "# required import\nfrom IPython.core.display import display, HTML\n",
          description: "display and HTML from IPython are required"
        },
        disabled: false
      }
    ];

    let content = [];
    sources.forEach(source => {
      content.push(
        <Col md="3" key={source.name} style={{ paddingBottom: "18px" }}>
          <Button
            color="primary"
            outline
            block
            disabled={source.disabled}
            style={{
              height: "120px",
              //backgroundColor: "transparent",
              //color: "black",
              fontSize: "28px"
            }}
            onClick={() => this.selectSource(source)}
          >
            {source.text}
          </Button>
        </Col>
      );
    });

    return (
      <div>
        <Row>
          <h5 style={{ paddingLeft: "20px" }}>Please select the data source</h5>
        </Row>{" "}
        <Row> {content}</Row>{" "}
      </div>
    );
  };

  updateValues = (name, value, inputType) => {
    let newValues = { ...this.state.values, [name]: value };
    this.setState({
      values: newValues
    });

    let { code } = this.state.selectedSource;

    for (const k in newValues) {
      let v = newValues[k];
      if (typeof v === "object" && v !== null && "value" in v) {
        v = v.value;
      }

      if (k === "filePath") {
        v = '"../data/uploaded/' + v + '"';
      }
      code = code.replace("{{" + k + "}}", v);
    }
    this.setState({ code: code });
  };

  render() {
    console.log("render vis wiz");
    console.log(this.state);
    let modalWidth =
      parseInt(Math.min(Math.max(window.innerWidth * 0.6, 800), 1500)) + "px";

    let content = "";

    if (this.state.selectedSource === "") {
      content = this.dataSources();
    } else {
      const { selectedSource } = this.state;
      const { values } = this.state;
      const { code } = this.state;

      let sourceInput = [];

      Object.values(selectedSource.input).forEach(i => {
        console.log(i.name, i.type);

        if (i.hasOwnProperty("type")) {
          if (i.type === "textInput") {
            sourceInput.push(
              <div key={i.description}>
                <b>{i.description}</b>
                <Input
                  type="text"
                  value={values[i.name]}
                  onChange={e =>
                    this.updateValues(i.name, e.target.value, i.type)
                  }
                />
              </div>
            );
          }
          if (i.type === "textAreaInput") {
            sourceInput.push(
              <div key={i.description}>
                <b>{i.description}</b>
                <Input
                  type="textarea"
                  rows={8}
                  value={values[i.name]}
                  onChange={e =>
                    this.updateValues(i.name, e.target.value, i.type)
                  }
                />
              </div>
            );
          } else if (i.type === "dataColumns") {
            let options = [];
            for (let [k, v] of Object.entries(this.props.dataColumns)) {
              options.push({ value: k, label: v });
            }
            const selectStyles = {
              menu: base => ({
                ...base,
                zIndex: 100
              })
            };
            sourceInput.push(
              <div key={i.description}>
                <b>{i.description}</b>
                <Select
                  styles={selectStyles}
                  options={options}
                  value={values[i.name]}
                  isMulti={i.settings.isMulti}
                  onChange={e => {
                    console.log("selected");
                    console.log(e);
                    this.updateValues(i.name, e, i.type);
                  }}
                />
              </div>
            );
          }
        }
        sourceInput.push(
          <div key={i.name + "padding"} style={{ paddingTop: "5px" }}></div>
        );
      });

      content = (
        <Row>
          <Col md="12">
            <p>
              Data source: {selectedSource.text}{" "}
              <Button
                onClick={() => {
                  this.setState({ selectedSource: "" });
                }}
                color="link"
                size="sm"
              >
                Change
              </Button>
            </p>
            <p>{selectedSource.description}</p>

            {sourceInput}
            {/*<code>{code}</code>*/}

            <b>CODE:</b>
            <CodeMirror
              value={code}
              options={{
                mode: "python",
                theme: "neat",
                lineNumbers: false
              }}
            />
          </Col>
        </Row>
      );
    }

    return (
      <Modal
        isOpen={true}
        toggle={this.props.closeModal}
        style={{ maxWidth: modalWidth, height: "800px" }}
      >
        <ModalHeader>
          {" "}
          <i className="fa fa-sliders" aria-hidden="true" /> Add widgets
        </ModalHeader>

        <ModalBody
          style={{
            magin: "0px",
            paddingLeft: "20px",
            paddingTop: "0px",
            paddingBottom: "0px"
          }}
        >
          <Row
            style={{
              marginTop: "5px",
              marginBottom: "5px",
              padding: "0px"
            }}
          >
            <Col md="12">{content}</Col>
          </Row>
        </ModalBody>
        <ModalFooter>
          <Button outline color="secondary" onClick={this.props.closeModal}>
            Cancel
          </Button>

          <Button
            color="primary"
            onClick={() => this.onAddToScript()}
            disabled={isEmpty(this.state.code)}
          >
            Add to script
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}

WidgetsModal.propTypes = {
  addToScript: PropTypes.func.isRequired,
  dataColumns: PropTypes.object.isRequired
};

const mapStateToProps = (state, ownProps) => ({
  dataColumns: state.cells.dataColumns
});

export default connect(mapStateToProps, { addToScript, getDataColumns })(
  withRouter(WidgetsModal)
);
