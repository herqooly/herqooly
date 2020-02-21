import {
  UPLOADED_FILES_LOADING,
  GET_UPLOADED_FILES_SUCCESS,
  GET_UPLOADED_FILES_ERROR,
  DELETE_UPLOADED_FILE,
  UPDATE_UPLOADED_FILE,
  ADD_UPLOADED_FILE
} from "./FileUploadListTypes";

const initialState = {
  files: null,

  loading: false,
  error_message: ""
};

export default function(state = initialState, action) {
  switch (action.type) {
    case UPLOADED_FILES_LOADING:
      return {
        ...state,
        files: [],
        loading: true,
        error_message: ""
      };
    case GET_UPLOADED_FILES_SUCCESS:
      return {
        ...state,
        files: action.payload,
        loading: false,
        error_message: ""
      };
    case GET_UPLOADED_FILES_ERROR:
      return {
        ...state,
        files: [],
        loading: false,
        error_message: action.error_message
      };
    case ADD_UPLOADED_FILE:
      return {
        ...state,
        files: [...state.files, action.newFile],
        loading: false
      };

    case UPDATE_UPLOADED_FILE:
      const updatedFiles = state.files.map(item => {
        if (item.id === action.updatedFile.id) {
          return { ...item, ...action.updatedFile };
        }
        return item;
      });

      return {
        ...state,
        files: updatedFiles,
        loading: false
      };
    case DELETE_UPLOADED_FILE:
      return {
        ...state,
        files: state.files.filter((item, index) => item.id !== action.fileId),
        loading: false
      };
    default:
      return state;
  }
}
