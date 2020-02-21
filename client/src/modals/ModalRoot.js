import React from "react";
import { connect } from "react-redux";

import CreateProjectModal from "./createProject/CreateProjectModal";
import CreateScriptModal from "./createScript/CreateScriptModal";
import ShareAppModal from "./shareApp/ShareAppModal";
import UploadFileModal from "./uploadFile/UploadFileModal";
import ReadDataModal from "./codeGen/readData/ReadDataModal";
import VisModal from "./codeGen/vis/VisModal";
import WidgetsModal from "./codeGen/widgets/WidgetsModal";
const MODAL_TYPES = {
  createProject: CreateProjectModal,
  createScript: CreateScriptModal,
  shareApp: ShareAppModal,
  upload: UploadFileModal,
  readData: ReadDataModal,
  vis: VisModal,
  widgets: WidgetsModal
};

const mapStateToProps = state => ({
  ...state.modal
});

class ModalContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalIsOpen: false
    };
    this.closeModal = this.closeModal.bind(this);
  }

  closeModal() {
    this.setState({ modalIsOpen: false });
  }

  render() {
    if (!this.props.modalType) {
      return null;
    }
    const SpecifiedModal = MODAL_TYPES[this.props.modalType];

    return (
      <div>
        <SpecifiedModal
          closeModal={this.closeModal}
          {...this.props.modalProps}
        />
      </div>
    );
  }
}

export default connect(mapStateToProps, null)(ModalContainer);
