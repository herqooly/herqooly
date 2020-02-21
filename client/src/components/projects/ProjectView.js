import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { getProjectDetail } from "./ProjectActions";

import moment from "moment";
//import { isEmpty } from "../../utils/Common";

class ProjectView extends Component {
  componentDidMount() {
    this.props.getProjectDetail(
      this.props.urlParams.organizationSlug,
      this.props.urlParams.projectId
    );
  }
  componentDidUpdate(prevProps) {}

  render() {
    const { organization } = this.props.auth;
    const { project } = this.props;

    let content = (
      <div className="container-fluid">
        <div className="row">
          <div className="col">
            <h2>
              <i className="fa fa-folder-open-o" aria-hidden="true" /> Project:{" "}
              {project.title}
            </h2>
            <p>{project.description}</p>
          </div>
          <div className="col text-center text-md-right">
            {" "}
            <small>
              Created at:{" "}
              {moment(project.created_at).format("MMMM Do YYYY, h:mm:ss a")} by{" "}
              <strong>{project.created_by_username}</strong>
              <br />
              Last update:{moment(project.updated_at).fromNow()}{" "}
            </small>
          </div>
        </div>
        <hr />
        <div className="row">
          <div className="col-3">
            <h5>Uploaded files</h5>
            <h2>
              <i className="fa fa-file-o" aria-hidden="true" />{" "}
              {project.uploaded_files_cnt}
            </h2>
            <Link
              to={
                "/" +
                organization.slug +
                "/project/" +
                project.id +
                "/uploaded/"
              }
            >
              List
            </Link>{" "}
            <br />
            <br />
          </div>

          <div className="col-3">
            <h5>Your code</h5>
            <h2>
              <i className="fa fa-code" aria-hidden="true" />{" "}
              {project.scripts_cnt}
            </h2>
            <Link
              to={"/" + organization.slug + "/project/" + project.id + "/src"}
            >
              List
            </Link>{" "}
            <br />
            <br />
          </div>

          {/*
          <div className="col-3">
            <h5>ML models</h5>
            <h2>
              <i className="fa fa-flask" aria-hidden="true" />{" "}
              {project.models_cnt}
            </h2>
            <Link
              to={
                "/" + organization.slug + "/project/" + project.id + "/models/"
              }
            >
              List
            </Link>
          </div>

          <div className="col-3">
            <h5>Created files</h5>
            <h2>
              <i className="fa fa-file-o" aria-hidden="true" /> 0
            </h2>
            <Link
              to={
                "/" + organization.slug + "/project/" + project.id + "/models/"
              }
            >
              List
            </Link>
            </div>*/}
        </div>
        <br />
        <hr />
        {/*<div className="row">
          <div className="col-12">
            <h3>
              <i className="fa fa-rocket" aria-hidden="true" /> How to start
            </h3>
            <ul>
              <li>It is easy. You will see!</li>

              <li>
                Good luck! In case any questions about MLJAR platform or machine
                learning, please feel free to contact us by email
              </li>
            </ul>
          </div>
          </div>*/}
      </div>
    );
    return content;
  }
}

ProjectView.propTypes = {
  urlParams: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  project: PropTypes.object.isRequired,
  getProjectDetail: PropTypes.func.isRequired
};

const mapStateToProps = (state, ownProps) => ({
  urlParams: ownProps.match.params,
  auth: state.auth,
  project: state.projects.project
});

export default connect(mapStateToProps, { getProjectDetail })(
  withRouter(ProjectView)
);
