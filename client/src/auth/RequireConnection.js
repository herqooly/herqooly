import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { connectToMLJARSever } from "./AuthActions"

export default function (Component) {
  class AuthenticatedComponent extends React.Component {
    static propTypes = {
      isAuthenticated: PropTypes.bool.isRequired,
      location: PropTypes.shape({
        pathname: PropTypes.string.isRequired
      }).isRequired,
     // dispatch: PropTypes.func.isRequired
    };

    componentDidMount() {
      this.checkAuth();
    }


    checkAuth() {
      if (!this.props.isAuthenticated) {
        this.props.connectToMLJARSever();
      }
    }

    render() {
      return (
        <div>
          {this.props.isAuthenticated === true ? (
            <Component {...this.props} />
          ) : 
          <div>
            Cannot connect to the server. <br />
            Please check that MLJAR Studio server is running at {process.env.REACT_APP_MLJAR_URL}. <br />
            Please check that Jupyter is running and connection with MLJAR Studio is correctly configured. <br />
            If you still have a problem, please submit the Github issue or contact us (contact@mljar.com), we will try to help!
          
          </div>}
        </div>
      );
    }
  }

  const mapStateToProps = state => {
    return {
      isAuthenticated: state.auth.isAuthenticated,
      token: state.auth.token
    };
  };

  return connect(mapStateToProps, {connectToMLJARSever})(AuthenticatedComponent);
}
