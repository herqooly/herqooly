import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Nav, NavItem } from "reactstrap";

import { Link } from "react-router-dom";
//import {isEmpty} from "../../utils/Common";

import Tooltip from "rc-tooltip";
import "rc-tooltip/assets/bootstrap_white.css";
import { isEmpty } from "../../utils/Common";

class LayoutWithLeftNavbar extends React.Component {
  render() {
    const { isAuthenticated, organization } = this.props.auth;

    let leftNav = "";
    if (isAuthenticated && !isEmpty(this.props)) {
      const { project } = this.props.projects;

      const projectDashboard =
        "/" + organization.slug + "/project/" + project.id;
      const srcLink = projectDashboard + "/src";
      const filesLink = projectDashboard + "/uploaded";
      //const mlLink = projectDashboard + "/ml";

      leftNav = (
        <div className="sidebar">
          <Nav vertical>
            <Tooltip
              placement="right"
              overlay="Project Dashboard"
              arrowContent={<div className="rc-tooltip-arrow-inner"></div>}
            >
              <div>
                <NavItem className={"nav-item-left"}>
                  <Link to={projectDashboard} className={"link-left nav-link"}>
                    <i
                      className="fa fa-lg fa-home icon-left"
                      aria-hidden="true"
                    />
                  </Link>
                </NavItem>
              </div>
            </Tooltip>

            <Tooltip
              placement="right"
              overlay="Your uploaded files"
              arrowContent={<div className="rc-tooltip-arrow-inner"></div>}
            >
              <div>
                <NavItem className={"nav-item-left"}>
                  <Link to={filesLink} className={"link-left nav-link"}>
                    <i
                      className="fa fa-lg fa-file-o icon-left"
                      aria-hidden="true"
                    />
                  </Link>
                </NavItem>
              </div>
            </Tooltip>

            <Tooltip
              placement="right"
              overlay="Your scripts"
              arrowContent={<div className="rc-tooltip-arrow-inner"></div>}
            >
              <div>
                <NavItem className={"nav-item-left"}>
                  <Link to={srcLink} className={"link-left nav-link"}>
                    <i
                      className="fa fa-lg fa-code icon-left"
                      aria-hidden="true"
                    />
                  </Link>
                </NavItem>
              </div>
            </Tooltip>

            {/*
            <Tooltip
              placement="right"
              overlay="Your Machine Learning models"
              arrowContent={<div className="rc-tooltip-arrow-inner"></div>}
            >
              <div>
                <NavItem className={"nav-item-left"}>
                  <Link to={mlLink} className={"link-left nav-link"}>
                    <i
                      className="fa fa-lg fa-flask icon-left"
                      aria-hidden="true"
                    />
                  </Link>
                </NavItem>
              </div>
            </Tooltip>

            <Tooltip
              placement="right"
              overlay="Files created in the project"
              arrowContent={<div className="rc-tooltip-arrow-inner"></div>}
            >
              <div>
                <NavItem className={"nav-item-left"}>
                  <Link to={filesLink} className={"link-left nav-link"}>
                    <i
                      className="fa fa-lg fa-file-o icon-left"
                      aria-hidden="true"
                    />
                  </Link>
                </NavItem>
              </div>
            </Tooltip>*/}
          </Nav>
        </div>
      );
    }

    return (
      <div className="container-fluid">
        <div className="row">
          {leftNav}
          <div className="main container-fluid">{this.props.children}</div>
        </div>
      </div>
    );
  }
}

LayoutWithLeftNavbar.propTypes = {
  auth: PropTypes.object.isRequired,
  projects: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired
};

const mapStateToProps = (state, ownProps) => {
  return {
    auth: state.auth,
    projects: state.projects
  };
};

export default connect(mapStateToProps, {})(LayoutWithLeftNavbar);
