import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import { Collapse, Navbar, Nav, NavItem } from "reactstrap";
import { isEmpty } from "../../utils/Common";

class NavbarMain extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false
    };
  }

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  render() {
    const { isAuthenticated, organization } = this.props.auth;

    let projectLink = "";
    if (!isEmpty(this.props.project)) {
      projectLink =
        "/" + organization.slug + "/project/" + this.props.project.id;
    }

    /*{isAuthenticated && (
            <Nav className="mr-auto" navbar>
              {isAuthenticated && (
                <NavItem>
                  <Link
                    to={"/" + organization.slug + "/projects/"}
                    className="nav-link"
                  >
                    All projects
                  </Link>
                </NavItem>
              )}
          
              
            </Nav>
          )} */

    return (
      <Navbar light expand="md" className="mb-3 align-items-baseline">
        <Link to="/" className="mljar-navbar-brand">
          Herqooly
        </Link>
        <Collapse isOpen={this.state.isOpen} navbar>
          {isAuthenticated && (
            <Nav className="mr-auto" navbar>
              {isAuthenticated && (
                <NavItem>
                  <Link
                    to={"/" + organization.slug + "/projects/"}
                    className="nav-link"
                  >
                    <i className="fa fa-th-large" aria-hidden="true" /> Projects
                  </Link>
                </NavItem>
              )}

              {projectLink && (
                <NavItem>
                  <Link to={projectLink} className="nav-link">
                    <strong>
                      <i className="fa fa-folder-open-o" aria-hidden="true" />{" "}
                      {this.props.project.title}
                    </strong>
                  </Link>
                </NavItem>
              )}
            </Nav>
          )}
        </Collapse>
      </Navbar>
    );
  }
}

NavbarMain.propTypes = {
  auth: PropTypes.object.isRequired,
  project: PropTypes.object.isRequired
};

const mapStateToProps = (state, ownProps) => ({
  auth: state.auth,
  project: state.projects.project
});

export default connect(mapStateToProps, {})(NavbarMain);
