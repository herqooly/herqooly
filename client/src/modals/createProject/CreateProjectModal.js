import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { Form, FormGroup, Label, Input } from "reactstrap";
import { addProject } from "../../components/projects/ProjectActions";

class CreateProjectModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShow: true,
      title: this.props.title,
      description: this.props.description
    };

    this.onChange = this.onChange.bind(this);
    this.onCreate = this.onCreate.bind(this);
  }
  onCreate() {
    if (this.state.title !== "") {
      const projectData = {
        title: this.state.title,
        description: this.state.description
      };
      this.props.addProject(projectData);
      this.props.closeModal();
    }
  }

  closeMe() {
    console.log("close me");
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
    return (
      <Modal
        isOpen={true}
        toggle={this.props.closeModal}
        size={"md"}
        autoFocus={false}
      >
        <ModalHeader>
          {" "}
          <i className="fa fa-rocket" aria-hidden="true" /> Create a new project
        </ModalHeader>
        <Form>
          <ModalBody>
            <FormGroup>
              <Label for="projTitle">Title</Label>
              <Input
                type="text"
                name="title"
                value={this.state.title}
                id="projTitle"
                placeholder="Name of your project"
                autoFocus={true}
                onChange={this.onChange}
                required
              />
            </FormGroup>

            <FormGroup>
              <Label for="projDesc">Description</Label>
              <Input
                type="textarea"
                rows={7}
                name="description"
                value={this.state.description}
                id="projDesc"
                onChange={this.onChange}
                placeholder="Description of project. What are you going to build?"
              />
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button outline color="secondary" onClick={this.props.closeModal}>
              Cancel
            </Button>
            <Button color="primary" onClick={this.onCreate}>
              Create
            </Button>{" "}
          </ModalFooter>
        </Form>
      </Modal>
    );
  }
}

CreateProjectModal.propTypes = {
  addProject: PropTypes.func.isRequired
};

const mapStateToProps = (state, ownProps) => ({});

export default connect(mapStateToProps, { addProject })(
  withRouter(CreateProjectModal)
);
