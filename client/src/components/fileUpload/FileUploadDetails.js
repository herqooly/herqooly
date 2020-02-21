import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import moment from "moment";

import { showModal, hideModal } from "../../modals/ModalActions";
import { Button, UncontrolledTooltip } from "reactstrap";
import confirm from "reactstrap-confirm";

import { deleteUploadedFile } from "./FileUploadListActions";
import filesize from "filesize";
class FileUploadDetails extends Component {
  componentDidMount() {}
  componentDidUpdate(prevProps) {}

  async deleteFile(fileId, fileTitle) {
    let confirmed = await confirm({
      title: "Please confirm",
      message: (
        <p>
          You are going to delete your data file: <b>{fileTitle}</b>. All items
          associated with this file will be irreversibly deleted. Please
          confirm.
        </p>
      ),
      confirmText: "Delete"
    });

    if (confirmed) {
      this.props.deleteUploadedFile(this.props.urlParams.projectId, fileId);
    }
  }

  openEditUploadFileModal(fileDetails) {
    /*this.props.showModal(
      {
        open: true,
        title: fileDetails.title,
        description: fileDetails.description,
        isEditMode: true,
        fileId: fileDetails.id,
        closeModal: this.props.hideModal
      },
      "uploadFile"
    );*/
  }

  render() {
    //const { organization } = this.props.auth;
    //const { projectDetail } = this.props.projectDetail;
    const { details } = this.props;
    console.log(details);
    return (
      <div className="col-6 mt-2" key={"file_source" + details.id}>
        <div className="projectdiv">
          <b className="projectTitle">
            <i className="fa fa-file-o" aria-hidden="true" /> {details.title}
          </b>
          <UncontrolledTooltip
            placement="top"
            target={"deleteFileBtn" + details.id}
          >
            Delete this data file
          </UncontrolledTooltip>
          {/*<UncontrolledTooltip
            placement="top"
            target={"editFileBtn" + details.id}
          >
            Edit this data file
          </UncontrolledTooltip>*/}
          <Button
            id={"deleteFileBtn" + details.id}
            color="link"
            className="float-right projectSmallButtons"
            onClick={this.deleteFile.bind(this, details.id, details.title)}
          >
            <i className="fa fa-times" aria-hidden="true" />
          </Button>
          {/*<Button
            id={"editFileBtn" + details.id}
            color="link"
            className="float-right projectSmallButtons"
            onClick={this.openEditUploadFileModal.bind(this, details)}
          >
            <i className="fa fa-pencil" aria-hidden="true" />
          </Button>*/}
          <br />
          <b>File name:</b> {details.file_name} <br />
          <b>File size:</b> {filesize(details.file_size)} <br />
          <b>Created at:</b>{" "}
          {moment(details.created_at).format("MMMM Do YYYY, h:mm:ss a")}
          <br />
          <b>Added by:</b> {details.created_by_username}
          <br />
          <b>Description:</b> {details.description}
          <br />
          <small>(Id: {details.id})</small>
          <br />
        </div>
      </div>
    );
  }
}

FileUploadDetails.propTypes = {
  deleteUploadedFile: PropTypes.func.isRequired
};

const mapStateToProps = (state, ownProps) => ({});

export default connect(mapStateToProps, {
  deleteUploadedFile,
  showModal,
  hideModal
})(withRouter(FileUploadDetails));
