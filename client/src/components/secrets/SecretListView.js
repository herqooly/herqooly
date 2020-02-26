import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { getProjectDetail } from "../projects/ProjectActions";

import moment from "moment";
import { isEmpty } from "../../utils/Common";

import { showModal, hideModal } from "../../modals/ModalActions";
import { Button, UncontrolledTooltip } from "reactstrap";
import confirm from "reactstrap-confirm";

import { getSecrets, deleteSecret } from "./SecretActions";
import { ListGroup, ListGroupItem, Badge } from "reactstrap";

class SecretList extends Component {
  constructor(props) {
    super(props);
  }

  onAddSecretModal = () => {
    this.props.showModal(
      {
        open: true,
        key: "",
        value: "",
        organizationSlug: this.props.urlParams.organizationSlug,
        projectId: this.props.urlParams.projectId,
        closeModal: this.props.hideModal
      },
      "addSecret"
    );
  };
  /*
  async deleteProject(projectId, projectTitle) {
    let confirmed = await confirm({
      title: "Please confirm",
      message: (
        <p>
          You are going to delete your project: <b>{projectTitle}</b>. All items
          associated with the project will be irreversibly deleted. Please
          confirm.
        </p>
      ),
      confirmText: "Delete"
    });

    if (confirmed) {
      const { organization } = this.props.auth;
      this.props.deleteProject(organization.slug, projectId);
    }
  }

  */

  componentDidMount() {
    this.props.getProjectDetail(
      this.props.urlParams.organizationSlug,
      this.props.urlParams.projectId
    );
    this.props.getSecrets(
      this.props.urlParams.organizationSlug,
      this.props.urlParams.projectId
    );
  }

  render() {
    const { secrets } = this.props.secrets;

    let items = [];
    secrets.forEach(secret => {
      items.push(
        <ListGroupItem key={"secret-key-" + secret.id}>
          <b>{secret.key}</b>: {secret.read_only_value}{" "}
          <Button
            color="danger"
            size="sm"
            style={{ float: "right" }}
            onClick={() =>
              this.props.deleteSecret(
                this.props.urlParams.organizationSlug,
                this.props.urlParams.projectId,
                secret.id
              )
            }
          >
            <i className="fa fa-trash-o" aria-hidden="true" /> Delete
          </Button>
        </ListGroupItem>
      );
    });

    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-6">
            <h2>
              <i className="fa fa-lock" aria-hidden="true" /> Your Secrets
            </h2>
          </div>

          <div className="col-6">
            <button
              className="btn btn-success btn-lg "
              onClick={this.onAddSecretModal}
              style={{ float: "right" }}
            >
              <i className="fa fa-plus" aria-hidden="true" /> Add a new secret
            </button>
          </div>
        </div>
        <hr />

        <div className="row">
          <div className="col-9">
            {items.length === 0 && (
              <p>
                No secret values defined. Please add your first secret value.
              </p>
            )}
            <ListGroup>{items}</ListGroup>
          </div>
        </div>
      </div>
    );
  }
}

SecretList.propTypes = {
  urlParams: PropTypes.object.isRequired,
  getProjectDetail: PropTypes.func.isRequired,

  showModal: PropTypes.func.isRequired,
  hideModal: PropTypes.func.isRequired,

  organization_slug: PropTypes.object.isRequired,
  projects: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  secrets: PropTypes.object.isRequired
};

const mapStateToProps = (state, ownProps) => ({
  urlParams: ownProps.match.params,
  organization_slug: ownProps.match.params,
  projects: state.projects,
  auth: state.auth,
  secrets: state.secrets
});

export default connect(mapStateToProps, {
  getProjectDetail,
  //openProject,
  showModal,
  hideModal,
  getSecrets,
  deleteSecret
})(withRouter(SecretList));
