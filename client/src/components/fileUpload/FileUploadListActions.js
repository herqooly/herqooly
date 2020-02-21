import axios from "axios";
import {
  UPLOADED_FILES_LOADING,
  GET_UPLOADED_FILES_SUCCESS,
  GET_UPLOADED_FILES_ERROR,
  DELETE_UPLOADED_FILE,
  UPDATE_UPLOADED_FILE
} from "./FileUploadListTypes";
import { toast } from "react-toastify";

export const getUploadedFiles = projectId => dispatch => {
  dispatch(setUploadedFilesLoading());
  axios
    .get(`/api/v1/${projectId}/uploaded/files`)
    .then(response =>
      dispatch({
        type: GET_UPLOADED_FILES_SUCCESS,
        payload: response.data
      })
    )
    .catch(error => {
      let error_message = "Fetching uploaded files problem. ";

      if (error.response) {
        error_message += error.response.data;
      }
      dispatch({
        type: GET_UPLOADED_FILES_ERROR,
        error_message: error_message
      });
    });
};

export const setUploadedFilesLoading = () => {
  return {
    type: UPLOADED_FILES_LOADING
  };
};

export const deleteUploadedFile = (projectId, fileId) => dispatch => {
  axios
    .delete(`/api/v1/${projectId}/uploaded/files/${fileId}`)
    .then(res => {
      dispatch({
        type: DELETE_UPLOADED_FILE,
        fileId: fileId
      });
    })
    .catch(err => {
      toast.error("Delete data file problem. " + err, {
        autoClose: 8000,
        hideProgressBar: true,
        newsetOnTop: true
      });
    });
};

export const updateUploadedFile = (
  organizationSlug,
  projectId,
  fileId,
  fileData
) => dispatch => {
  axios
    .patch(
      `/api/v1/${organizationSlug}/${projectId}/file_sources/${fileId}`,
      fileData
    )
    .then(res => {
      dispatch({ type: UPDATE_UPLOADED_FILE, updatedFile: res.data });
    })
    .catch(err => {
      toast.error("Update project problem. " + err, {
        autoClose: 8000,
        hideProgressBar: true,
        newsetOnTop: true
      });
    });
};
