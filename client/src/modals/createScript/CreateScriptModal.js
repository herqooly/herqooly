import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { Form, FormGroup, Label, Input } from "reactstrap";
import { addScript } from "../../components/scripts/ScriptActions";

class CreateScriptModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShow: true,
      title: this.props.title
    };
    this.onChange = this.onChange.bind(this);
    this.onCreate = this.onCreate.bind(this);
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  onCreate() {
    if (this.state.title !== "") {
      const scriptData = {
        title: this.state.title
      };
      this.props.addScript(
        this.props.organizationSlug,
        this.props.projectId,
        scriptData
      );
      this.props.closeModal();
    }
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
          <i className="fa fa-code" aria-hidden="true" /> Create a new script
        </ModalHeader>
        <Form>
          <ModalBody>
            <FormGroup>
              <Label for="scriptTitle">Title</Label>
              <Input
                type="text"
                name="title"
                value={this.state.title}
                id="scriptTitle"
                placeholder="Name of your script"
                autoFocus={true}
                onChange={this.onChange}
                required
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

CreateScriptModal.propTypes = {
  addScript: PropTypes.func.isRequired
};

const mapStateToProps = (state, ownProps) => ({});

export default connect(mapStateToProps, { addScript })(
  withRouter(CreateScriptModal)
);
