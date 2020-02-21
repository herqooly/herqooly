import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Row, Col } from "reactstrap";

import { getSharedWidgets } from "./SharedActions";
import SharedWidgetsView from "../scripts/widgets/SharedWidgetsView";

class SharedView extends Component {
  componentDidMount() {
    this.props.getSharedWidgets(this.props.urlParams.shareUid);
  }

  render() {
    return (
      <div className="container-fluid">
        <Row>
          <Col md={12} style={{ paddingRight: "0px" }}>
            <SharedWidgetsView {...this.props} />
          </Col>
        </Row>
      </div>
    );
  }
}

SharedView.propTypes = {
  urlParams: PropTypes.object.isRequired
};

const mapStateToProps = (state, ownProps) => ({
  urlParams: ownProps.match.params
});

export default connect(mapStateToProps, { getSharedWidgets })(
  withRouter(SharedView)
);
