import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { Button } from "reactstrap";

import { showModal, hideModal } from "../../modals/ModalActions";

class EmptyScriptsView extends Component {
  addScript = () => {
    this.props.showModal(
      {
        open: true,
        title: "",
        organizationSlug: this.props.urlParams.organizationSlug,
        projectId: this.props.urlParams.projectId,
        closeModal: this.props.hideModal
      },
      "createScript"
    );
  };

  render() {
    return (
      <div className="container-fluid">
        <h5>Please add your first script!</h5>
        <Button color="success" onClick={this.addScript}>
          <i className="fa fa-plus" aria-hidden="true" /> Add script
        </Button>
      </div>
    );
  }
}

EmptyScriptsView.propTypes = {
  urlParams: PropTypes.object.isRequired
};

const mapStateToProps = (state, ownProps) => ({
  urlParams: ownProps.match.params
});

export default connect(mapStateToProps, {
  showModal,
  hideModal
})(withRouter(EmptyScriptsView));
