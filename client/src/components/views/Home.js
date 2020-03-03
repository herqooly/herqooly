import React, { Component } from "react";

import { Card, CardTitle, CardText, Row, Col } from "reactstrap";

import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";

class Home extends Component {
  render() {
    const { organization } = this.props.auth;
    const projects_card = (
      <Col sm="6" style={{ padding: "15px" }}>
        <Card body>
          <CardTitle>Projects</CardTitle>
          <CardText>List of your amazing projects</CardText>

          <Link
            to={"/" + organization.slug + "/projects/"}
            className="btn btn-primary mt-2 btn-block"
          >
            Open projects
          </Link>
        </Card>
      </Col>
    );
    return (
      <div className="container text-center">
        <h2 className={"brand-header"}> Herqooly</h2>
        <h3> Your Programming Superpowers </h3>
        <div className="container-fluid">
          <Row>
            {projects_card}

            {/*<Col sm="6" style={{ padding: "15px" }}>
              <Card body>
                <CardTitle>Documentation</CardTitle>
                <CardText>Check our documentation and FAQ</CardText>

                <a
                  href="https://github.com/mljar/mljar/wiki"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-info mt-2 btn-block"
                >
                  Open documentation
                </a>
              </Card>
    </Col>*/}
            <Col sm="6" style={{ padding: "15px" }}>
              <Card body>
                <CardTitle>Got feature request or found a bug?</CardTitle>
                <CardText>Please submit the issue on github.</CardText>
                <a
                  href="https://github.com/mljar/mljar-studio/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary mt-2 btn-block"
                >
                  Submit issue
                </a>
              </Card>
            </Col>
            {/*<Col sm="6" style={{ padding: "15px" }}>
              <Card body>
                <CardTitle>Need support?</CardTitle>
                <CardText>
                  Please check github issues or send us email at
                  contact@mljar.com.
                </CardText>

                <a
                  href="https://github.com/mljar/mljar/issues/new?labels=Support&template=--support.md"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary mt-2 btn-block"
                >
                  Github issues
                </a>
              </Card>
    </Col>*/}
          </Row>
        </div>
      </div>
    );
  }
}
Home.propTypes = {
  auth: PropTypes.object.isRequired
};

const mapStateToProps = (state, ownProps) => ({
  auth: state.auth
});

export default connect(mapStateToProps)(withRouter(Home));
