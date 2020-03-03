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

import { getPeriodicJobs } from "./PeriodicJobActions";
import { ListGroup, ListGroupItem, Badge } from "reactstrap";

class PeriodicJobList extends Component {
  constructor(props) {
    super(props);
  }

  setPeriodicJobInerval = (scriptId, scriptTitle, scriptInterval) => {
    this.props.showModal(
      {
        open: true,
        organizationSlug: this.props.urlParams.organizationSlug,
        projectId: this.props.urlParams.projectId,
        closeModal: this.props.hideModal,
        scriptId: scriptId,
        title: scriptTitle,
        interval: scriptInterval
      },
      "setPeriodicJob"
    );
  };

  componentDidMount() {
    this.props.getProjectDetail(
      this.props.urlParams.organizationSlug,
      this.props.urlParams.projectId
    );
    this.props.getPeriodicJobs(
      this.props.urlParams.organizationSlug,
      this.props.urlParams.projectId
    );
  }

  getNiceStr = interval => {
    if (interval === 0) {
      return "Never refresh";
    } else {
      return "Reapet every " + interval + " seconds";
    }
  };

  render() {
    const { periodicJobs } = this.props.periodicJobs;

    let items = [];
    periodicJobs.forEach(script => {
      items.push(
        <ListGroupItem key={"jobs-key-" + script.id}>
          Script: {script.title} {this.getNiceStr(script.interval)}
          <Button
            color="success"
            size="sm"
            style={{ float: "right" }}
            onClick={() =>
              this.setPeriodicJobInerval(
                script.id,
                script.title,
                script.interval
              )
            }
          >
            <i className="fa fa-cog" aria-hidden="true" /> Set refresh interval
          </Button>
        </ListGroupItem>
      );
    });

    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-6">
            <h2>
              <i className="fa fa-clock-o" aria-hidden="true" /> Your Periodic
              Jobs
            </h2>
          </div>
        </div>
        <hr />

        <div className="row">
          <div className="col-6">
            {items.length === 0 && (
              <p>
                No periodic jobs defined. Please add your first periodic job.
              </p>
            )}
            <ListGroup>{items}</ListGroup>
          </div>
        </div>
      </div>
    );
  }
}

PeriodicJobList.propTypes = {
  urlParams: PropTypes.object.isRequired,
  getProjectDetail: PropTypes.func.isRequired,

  showModal: PropTypes.func.isRequired,
  hideModal: PropTypes.func.isRequired,

  organization_slug: PropTypes.object.isRequired,
  projects: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  periodicJobs: PropTypes.object.isRequired
};

const mapStateToProps = (state, ownProps) => ({
  urlParams: ownProps.match.params,
  organization_slug: ownProps.match.params,
  projects: state.projects,
  auth: state.auth,
  periodicJobs: state.periodicJobs
});

export default connect(mapStateToProps, {
  getProjectDetail,
  //openProject,
  showModal,
  hideModal,
  getPeriodicJobs
})(withRouter(PeriodicJobList));
