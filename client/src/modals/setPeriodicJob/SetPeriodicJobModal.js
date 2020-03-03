import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { Form, FormGroup, Label, Input } from "reactstrap";
import { updatePeriodicJob } from "../../components/periodic/PeriodicJobActions";

class SetPeriodicJobModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShow: true,
      interval: this.props.interval,
      scriptId: this.props.scriptId
    };
    this.onChange = this.onChange.bind(this);
    this.onUpdate = this.onUpdate.bind(this);
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  onUpdate() {
    const job = {
      interval: this.state.interval
    };

    console.log(this.props);
    this.props.updatePeriodicJob(
      this.props.organizationSlug,
      this.props.projectId,
      this.props.scriptId,
      job
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
          <i className="fa fa-clock-o" aria-hidden="true" /> Add periodic job to
          script: {this.props.title}
        </ModalHeader>
        <Form>
          <ModalBody>
            <FormGroup>
              <Label for="periodSelectId">Refresh every</Label>

              <Input
                type="select"
                name="interval"
                id="periodSelectId"
                value={this.state.interval}
                onChange={this.onChange}
              >
                <option value="0">Never refresh</option>
                <option value="60">1 minute</option>
                <option value="300">5 minutes</option>
                <option value="600">10 minutes</option>
                <option value="1800">30 minutes</option>
                <option value="3600">1 hour</option>
                <option value="14400">4 hours</option>
                <option value="86400">24 hours</option>
              </Input>
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button outline color="secondary" onClick={this.props.closeModal}>
              Cancel
            </Button>
            <Button color="primary" onClick={this.onUpdate}>
              Update
            </Button>{" "}
          </ModalFooter>
        </Form>
      </Modal>
    );
  }
}

SetPeriodicJobModal.propTypes = {};

const mapStateToProps = (state, ownProps) => ({});

export default connect(mapStateToProps, { updatePeriodicJob })(
  withRouter(SetPeriodicJobModal)
);
