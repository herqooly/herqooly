import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { FormGroup, Label, Input, Form } from "reactstrap";
import { upload, resetModalReducer } from "./UploadFileModalActions";
//import { updateUploadedFile } from "../../components/fileUpload/FileUploadListActions";

class UploadFileModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShow: true,
      title: this.props.title,
      description: this.props.description,
      isEditMode: this.props.isEditMode,
      selectedFile: null,
      fileId: this.props.fileId
    };

    this.onChange = this.onChange.bind(this);
    this.onUpload = this.onUpload.bind(this);
    this.onUpdate = this.onUpdate.bind(this);
    this.onFileChosen = this.onFileChosen.bind(this);
  }

  componentDidMount() {
    this.props.resetModalReducer();
  }

  onFileChosen(event) {
    this.setState({ selectedFile: event.target.files[0], loaded: 0 });
  }

  onUpload() {
    if (this.state.title === "") {
      return;
    }

    const newFile = {
      title: this.state.title,
      description: this.state.description,
      file_name: this.state.selectedFile.name,
      f: this.state.selectedFile,
      file_size: this.state.selectedFile.size,
      location: "uploaded"
    };
    this.props.upload(newFile, this.props.closeModal);
  }

  onUpdate() {
    console.log("Not implemented");
    /*
    if (this.state.title === "") {
      return;
    }

    const updatedDetails = {
      title: this.state.title,
      description: this.state.description
    };

    this.props.updateUploadedFile(
      this.props.auth.organization.slug,
      this.props.projectDetail.projectDetail.id,
      this.props.fileId,
      updatedDetails
    );
    this.props.closeModal();
    */
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
    const { status, loaded } = this.props.fileUpload;

    return (
      <Modal
        isOpen={true}
        toggle={this.props.closeModal}
        size={"md"}
        autoFocus={false}
      >
        {!this.state.isEditMode && (
          <ModalHeader>
            {" "}
            <i className="fa fa-file-o" aria-hidden="true" /> Upload new file
          </ModalHeader>
        )}
        {this.state.isEditMode && (
          <ModalHeader>
            {" "}
            <i className="fa fa-file-o" aria-hidden="true" /> Edit uploaded file
          </ModalHeader>
        )}

        <Form>
          <ModalBody>
            <FormGroup>
              <Label for="fileTitle">Title</Label>
              <Input
                type="text"
                name="title"
                value={this.state.title}
                id="fileTitle"
                placeholder="Name of your file"
                autoFocus={true}
                onChange={this.onChange}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label for="fileDesc">Description</Label>
              <Input
                type="textarea"
                rows={3}
                name="description"
                value={this.state.description}
                id="fileDesc"
                onChange={this.onChange}
                placeholder="Description of data file (optional)"
              />
            </FormGroup>
            {!this.state.isEditMode && (
              <FormGroup>
                <Label for="fileUpload">Please choose a file</Label>
                <Input
                  type="file"
                  name="fileName"
                  id="fileUpload"
                  onChange={e => this.onFileChosen(e)}
                  required
                />
              </FormGroup>
            )}

            {status !== "" && (
              <small>
                {status}
                <br />
                Loaded: {loaded}%
              </small>
            )}
          </ModalBody>
          <ModalFooter>
            <Button outline color="secondary" onClick={this.props.closeModal}>
              Cancel
            </Button>
            {!this.state.isEditMode && (
              <Button color="primary" onClick={this.onUpload}>
                Upload file
              </Button>
            )}
            {this.state.isEditMode && (
              <Button color="primary" onClick={this.onUpdate}>
                Update
              </Button>
            )}{" "}
          </ModalFooter>
        </Form>
      </Modal>
    );
  }
}

UploadFileModal.propTypes = {
  upload: PropTypes.func.isRequired,

  //updateUploadedFile: PropTypes.func.isRequired,

  fileUpload: PropTypes.object.isRequired
};

const mapStateToProps = (state, ownProps) => ({
  fileUpload: state.fileUpload
});

export default connect(mapStateToProps, {
  upload,
  resetModalReducer
  //updateUploadedFile
})(withRouter(UploadFileModal));
