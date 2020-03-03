import React from "react";
import { connect } from "react-redux";

class FooterMain extends React.Component {
  render() {
    return (
      <footer className="footer">
        <div>Herqooly</div>
      </footer>
    );
  }
}

FooterMain.propTypes = {};

const mapStateToProps = state => ({});

export default connect(mapStateToProps, {})(FooterMain);
