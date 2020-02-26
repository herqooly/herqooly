import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { Form, FormGroup, Label, Input } from "reactstrap";
import { addSecret } from "../../components/secrets/SecretActions";

class AddSecretModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShow: true,
      key: "",
      value: ""
    };
    this.onChange = this.onChange.bind(this);
    this.onCreate = this.onCreate.bind(this);
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  onCreate() {
    const secret = {
      key: this.state.key,
      value: this.state.value
    };

    console.log(this.props);
    this.props.addSecret(
      this.props.organizationSlug,
      this.props.projectId,
      secret
    );
    this.props.closeModal();
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
          <i className="fa fa-lock" aria-hidden="true" /> Add secret variable
        </ModalHeader>
        <Form>
          <ModalBody>
            <FormGroup>
              <Label for="keyId">Key</Label>
              <Input
                type="text"
                name="key"
                value={this.state.key}
                id="keyId"
                placeholder="Key name, should be all upper case, no spaces"
                autoFocus={true}
                onChange={this.onChange}
                required
              />

              <Label for="valueId">Value</Label>
              <Input
                type="text"
                name="value"
                value={this.state.value}
                id="valueId"
                placeholder="Value of your secret"
                autoFocus={false}
                onChange={this.onChange}
                required
              />
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button outline color="secondary" onClick={this.props.closeModal}>
              Cancel
            </Button>
            <Button
              color="primary"
              onClick={this.onCreate}
              disabled={this.state.key === "" || this.state.value === ""}
            >
              Create
            </Button>{" "}
          </ModalFooter>
        </Form>
      </Modal>
    );
  }
}

AddSecretModal.propTypes = {
  addSecret: PropTypes.func.isRequired
};

const mapStateToProps = (state, ownProps) => ({});

export default connect(mapStateToProps, { addSecret })(
  withRouter(AddSecretModal)
);
