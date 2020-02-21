import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { getProjects, openProject, deleteProject } from "./ProjectActions";

import moment from "moment";
import {isEmpty} from "../../utils/Common";

import { showModal, hideModal } from "../../modals/ModalActions";
import { Button, UncontrolledTooltip } from "reactstrap";
import confirm from "reactstrap-confirm";

class ProjectList extends Component {
  constructor(props) {
    super(props);
    this.openCreateProjectModal = this.openCreateProjectModal.bind(this);
  }

  openCreateProjectModal() {
    
    this.props.showModal(
      {
        open: true,
        title: "",
        description: "",
        closeModal: this.props.hideModal
      },
      "createProject"
    );
  }

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

  componentDidMount() {
    const { organization } = this.props.auth;
    this.props.getProjects(organization.slug);
  }

  componentDidUpdate(prevProps) {
    
  }

  onOpenProject(id) {
    const { organization } = this.props.auth;
    this.props.openProject(organization.slug, id);
  }

  render() {
    const { projects, loading } = this.props.projects;
    let projectsItems;

    if (isEmpty(projects) && loading) {
      projectsItems = <div>Loading projects. Please wait ...</div>;
    } else {
      if (projects.length > 0) {
        projectsItems = projects.map((project, index) => {
          return (
            <div className="col-6 mt-2" key={"proj" + index}>
              <div className="projectdiv">
                <b className="projectTitle">
                  <i className="fa fa-folder-o" aria-hidden="true" />{" "}
                  {project.title}
                </b>
                <UncontrolledTooltip
                  placement="top"
                  target={"deleteProjectBtn" + index}
                >
                  Delete this project
                </UncontrolledTooltip>
                
                <Button
                  id={"deleteProjectBtn" + index}
                  color="link"
                  className="float-right projectSmallButtons"
                  onClick={this.deleteProject.bind(
                    this,
                    project.id,
                    project.title
                  )}
                >
                  <i className="fa fa-times" aria-hidden="true" />
                </Button>
                
                <br />
                <b>Description:</b> {project.description} <br />
                <b>Created by:</b> {project.created_by_username} <br />

                <br />
                <b>Created at:</b>{" "}
                {moment(project.created_at).format("MMMM Do YYYY, h:mm:ss a")}{" "}
                <br />
                <small>(Id: {project.id}, Slug: {project.slug})</small>
                <br />
                <Button
                  color="primary"
                  className="float-right"
                  onClick={this.onOpenProject.bind(this, project.id)}
                >
                  <b>
                    Open project{" "}
                    <i className="fa fa-arrow-right" aria-hidden="true" />
                  </b>
                </Button>{" "}
                <br />
                <br />
              </div>
            </div>
          );
        });
      } else {
        projectsItems = <div>No projects here! To start creating amazing things please add a new project by clicking on the green button "Add a new project".</div>;
      }
    }

    return (
      <div className="container">
        <div className="row">
          <div className="col-6">
            <h2>
              Your Projects
            </h2>
          </div>

          <div className="col-6">
            <button
              className="btn btn-success btn-lg "
              onClick={this.openCreateProjectModal}
              style={{float: "right"}}
            >
              <i className="fa fa-plus" aria-hidden="true" /> Add a new project
            </button>
          </div>
        </div>
        <hr />

        <div className="container">
          
            <div className="row  mb-3 mt-3">{projectsItems}</div>
          
        </div>
      </div>
    );
  }
}

ProjectList.propTypes = {
  getProjects: PropTypes.func.isRequired,
  openProject: PropTypes.func.isRequired,
  deleteProject: PropTypes.func.isRequired,

  showModal: PropTypes.func.isRequired,
  hideModal: PropTypes.func.isRequired,

  organization_slug: PropTypes.object.isRequired,
  projects: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = (state, ownProps) => ({
  organization_slug: ownProps.match.params,
  projects: state.projects,
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { getProjects, openProject,
     showModal, hideModal, 
     deleteProject }
)(withRouter(ProjectList));
