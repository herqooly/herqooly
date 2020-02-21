import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { isEmpty } from "../../utils/Common";

import { getUploadedFiles } from "./FileUploadListActions";
import FileUploadDetails from "./FileUploadDetails";
import { showModal, hideModal } from "../../modals/ModalActions";
import { Button } from "reactstrap";

import { getProjectDetail } from "../projects/ProjectActions";

class FileUploadListView extends Component {
  componentDidMount() {
    this.props.getProjectDetail(
      this.props.urlParams.organizationSlug,
      this.props.urlParams.projectId
    );

    this.props.getUploadedFiles(this.props.urlParams.projectId);
  }

  uploadFileModal() {
    console.log("upload modal");
    this.props.showModal(
      {
        open: true,
        title: "",
        description: "",
        isEditMode: false,
        closeModal: this.props.hideModal
      },
      "upload"
    );
  }

  render() {
    const { files, loading } = this.props.uploaded;
    let items;

    if (loading) {
      items = <div>Loading uploaded files ...</div>;
    } else {
      if (!isEmpty(files) && files.length > 0) {
        items = files.map(uploadedFile => {
          return (
            <FileUploadDetails
              details={uploadedFile}
              {...this.props}
              key={uploadedFile.id}
            />
          );
        });
      } else {
        items = (
          <div>
            Uploaded files list is empty. Please upload your first data file.
          </div>
        );
      }
    }

    return (
      <div className="container-fluid">
        <h3>
          <i className="fa fa-file-o" aria-hidden="true" /> Uploaded files
          <Button
            color="success"
            className="float-right"
            onClick={this.uploadFileModal.bind(this)}
          >
            <i className="fa fa-plus" aria-hidden="true" /> Upload new file
          </Button>
        </h3>
        <hr />
        <div className="container-fluid">
          <div className="row  mb-3 mt-3">{items}</div>
        </div>
      </div>
    );
  }
}

FileUploadListView.propTypes = {
  urlParams: PropTypes.object.isRequired,
  getProjectDetail: PropTypes.func.isRequired,
  getUploadedFiles: PropTypes.func.isRequired,

  uploaded: PropTypes.object.isRequired
};

const mapStateToProps = (state, ownProps) => ({
  urlParams: ownProps.match.params,
  uploaded: state.uploaded
});

export default connect(mapStateToProps, {
  getProjectDetail,
  getUploadedFiles,
  showModal,
  hideModal
})(withRouter(FileUploadListView));
