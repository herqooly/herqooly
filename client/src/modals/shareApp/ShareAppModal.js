import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { Form, FormGroup } from "reactstrap";
import { addScript } from "../../components/scripts/ScriptActions";

class ShareAppModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShow: true
    };
  }

  onOK = () => {
    this.props.closeModal();
  };

  render() {
    let items = [];
    this.props.links.forEach(link => {
      let header = <h5>The static widgets view.</h5>;
      if (link.config === "execute") {
        header = <h5>The widgets view with execute button.</h5>;
      }
      let a = (
        <div
          style={{
            border: "1px solid #eee",
            marginTop: "10px",
            padding: "5px"
          }}
          key={link.uid}
        >
          {header}
          <a
            href={window.location.origin + "/share/" + link.uid}
            target="_blank"
            rel="noopener noreferrer"
          >
            {window.location.origin}/share/{link.uid}
          </a>
        </div>
      );

      items.push(a);
    });

    return (
      <Modal
        isOpen={true}
        toggle={this.props.closeModal}
        size={"md"}
        autoFocus={false}
      >
        <ModalHeader>
          {" "}
          <i className="fa fa-share-alt" aria-hidden="true" /> Share the app
        </ModalHeader>
        <Form>
          <ModalBody>
            <h3>Links to share the app</h3>
            <FormGroup>{items}</FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.onOK}>
              OK
            </Button>{" "}
          </ModalFooter>
        </Form>
      </Modal>
    );
  }
}

ShareAppModal.propTypes = {
  addScript: PropTypes.func.isRequired,
  links: PropTypes.array.isRequired
};

const mapStateToProps = (state, ownProps) => ({
  links: state.scripts.links
});

export default connect(mapStateToProps, { addScript })(
  withRouter(ShareAppModal)
);
