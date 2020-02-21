import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { Input } from "reactstrap";

import { Row, Col } from "reactstrap";

import { getUploadedFiles } from "../../../components/fileUpload/FileUploadListActions";
import { isEmpty } from "../../../utils/Common";

import { Controlled as CodeMirror } from "react-codemirror2";

import "codemirror/theme/neat.css";
import "codemirror/mode/python/python.js";

import { addToScript } from "../../../components/scripts/cells/CellsActions";

class ReadDataModal extends Component {
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
    if (isEmpty(this.props.uploaded.files)) {
      const { projectId } = this.props;
      this.props.getUploadedFiles(projectId);
    }
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
        name: "read_csv",
        disabled: false,
        text: "CSV",
        description: "Read data from CSV file",
        input: {
          variable: {
            name: "variable",
            type: "textInput",
            description: "The variable name which will store the data.",
            value: ""
          },
          filePath: {
            name: "filePath",
            optionName: "Please select the source",
            type: "uploadedFiles",
            description:
              "The path to the file with data from your uploaded files.",
            value: ""
          }
        },
        code:
          "# required import\nimport pandas as pd\n# code to read data\n{{variable}} = pd.read_csv({{filePath}})\n{{variable}}",
        requirements: {
          code: "# required import\nimport pandas as pd\n",
          description: "Pandas library is required"
        }
      },
      {
        name: "read_json",
        disabled: true,
        text: "JSON"
      },
      {
        name: "read_html",
        disabled: true,
        text: "HTML"
      },
      {
        name: "read_excel",
        disabled: true,
        text: "MS Excel"
      },
      {
        name: "read_open_doc",
        disabled: true,
        text: "Open Doc"
      },
      {
        name: "read_hdf5",
        disabled: true,
        text: "HDF5"
      },
      {
        name: "read_feather",
        disabled: true,
        text: "Feather"
      },
      {
        name: "read_parquet",
        disabled: true,
        text: "Parquet"
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
          <h5 style={{ paddingLeft: "20px" }}>
            Please select the type of data source
          </h5>
        </Row>{" "}
        <Row> {content}</Row>{" "}
      </div>
    );
  };

  updateValues = (name, value, inputType) => {
    console.log(name + " -update- " + value + " of " + inputType);

    let newValues = this.state.values;
    newValues[name] = value;
    this.setState({
      values: newValues
    });

    let { code } = this.state.selectedSource;

    for (const k in newValues) {
      let v = newValues[k];
      if (k === "filePath") {
        v = '"../data/uploaded/' + v + '"';
      }
      const find = "{{" + k + "}}";
      const re = new RegExp(find, "g");
      code = code.replace(re, v);
    }
    this.setState({ code: code });
  };

  getUploadedFiles = (name, selValue, inputType) => {
    const { files } = this.props.uploaded;
    let items = [];

    for (let i = 0; i < files.length; i++) {
      items.push(
        <option key={files[i].id} value={files[i].file_name}>
          {files[i].title} ({files[i].file_name})
        </option>
      );
    }
    items.unshift(
      <option value="" disabled key={"disbale-0"}>
        Please select a file
      </option>
    );

    return (
      <div key="uploadedFiles">
        <b>Input file</b> (In case you don't see the file, please upload it
        after selecting "Uploaded files" from left menu)
        <Input
          type="select"
          value={selValue}
          onChange={e => {
            this.updateValues(name, e.target.value, inputType);
          }}
        >
          {items}
        </Input>
      </div>
    );
  };

  render() {
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
          } else if (i.type === "uploadedFiles") {
            sourceInput.push(
              this.getUploadedFiles(i.name, values[i.name], i.type)
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
                Change data source
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
          <i className="fa fa-download" aria-hidden="true" /> Read data in the
          script
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

ReadDataModal.propTypes = {
  //organizationSlug: PropTypes.object.isRequired,
  //projectId: PropTypes.object.isRequired,
  //auth: PropTypes.object.isRequired,

  getUploadedFiles: PropTypes.func.isRequired,
  uploaded: PropTypes.object.isRequired,
  addToScript: PropTypes.func.isRequired
};

const mapStateToProps = (state, ownProps) => ({
  //auth: state.auth,
  uploaded: state.uploaded
});

export default connect(mapStateToProps, { getUploadedFiles, addToScript })(
  withRouter(ReadDataModal)
);
