import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";
import modalReducer from "./modals/ModalReducer";
import authReducer from "./auth/AuthReducer";
import projectListReducer from "./components/projects/ProjectListReducer";
import scriptsReducer from "./components/scripts/ScriptReducer";
import cellsReducer from "./components/scripts/cells/CellsReducer";
import wsReducer from "./components/scripts/wsContainer/WebSocketReducer";
import widgetsReducer from "./components/scripts/widgets/WidgetsReducer";
import uploadedReducer from "./components/fileUpload/FileUploadListReducer";
import fileUploadModalReducer from "./modals/uploadFile/UploadFileModalReducer";
import secretsReducer from "./components/secrets/SecretReducer";

export default history =>
  combineReducers({
    router: connectRouter(history),
    modal: modalReducer,
    auth: authReducer,
    projects: projectListReducer,
    scripts: scriptsReducer,
    cells: cellsReducer,
    ws: wsReducer,
    widgets: widgetsReducer,
    uploaded: uploadedReducer,
    fileUpload: fileUploadModalReducer,
    secrets: secretsReducer
  });
