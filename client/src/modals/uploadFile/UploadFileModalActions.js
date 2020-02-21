import axios from "axios";
import {
  UPLOAD_SUCCESS,
  UPLOAD_ERROR,
  UPLOAD_STATUS,
  UPLOAD_PROGRESS,
  RESET_UPLOAD_STATE
} from "./UploadFileModalTypes";

import { ADD_UPLOADED_FILE } from "../../components/fileUpload/FileUploadListTypes";
import { toast } from "react-toastify";
//import { close } from "fs";

export const resetModalReducer = () => dispatch => {
  dispatch({
    type: RESET_UPLOAD_STATE
  });
};

const Uint8ToString = u8a => {
  var CHUNK_SZ = 0x8000;
  var c = [];
  for (var i = 0; i < u8a.length; i += CHUNK_SZ) {
    c.push(String.fromCharCode.apply(null, u8a.subarray(i, i + CHUNK_SZ)));
  }
  return c.join("");
};

export const upload = (newFile, closeModal) => (dispatch, getState) => {
  dispatch({
    type: UPLOAD_STATUS,
    status: "Upload started ..."
  });

  const { f } = newFile;
  const { project } = getState().projects;
  const { jupyter } = getState().auth;
  const uploadUrl =
    "/api/contents/sandbox/" + project.slug + "/data/uploaded/" + f.name;

  let uploadInstance = axios.create({
    baseURL: jupyter.url,
    headers: { Authorization: "Token " + jupyter.token }
  });

  var chunk_size = 1024 * 1024 * 1;
  var offset = 0;
  var chunk = 0;
  var chunk_reader = null;

  const large_reader_onload = function(event) {
    if (event.target.error == null) {
      offset += chunk_size;
      if (offset >= f.size) {
        chunk = -1;
      } else {
        chunk += 1;
      }

      if (offset - chunk_size < f.size) {
        // push to the server
        let buf = new Uint8Array(event.target.result);
        let payload = {
          chunk: chunk,
          type: "file",
          content: btoa(Uint8ToString(buf)),
          format: "base64"
        };

        let onSuccess = res => {
          dispatch({
            type: UPLOAD_PROGRESS,
            loaded: Math.round(((offset - chunk_size) / f.size) * 100.0)
          });
        };
        if (chunk === -1) {
          onSuccess = res => {
            dispatch(saveFile(project.id, newFile, closeModal));
            dispatch({
              type: UPLOAD_PROGRESS,
              loaded: 100.0
            });
            dispatch({
              type: UPLOAD_SUCCESS,
              status: "Upload success"
            });
          };
        }

        uploadInstance
          .put(uploadUrl, payload)
          .then(res => onSuccess())
          .catch(err =>
            dispatch({
              type: UPLOAD_ERROR,
              status: "Upload problems " + err
            })
          );

        chunk_reader(offset, f);
      }
    } else {
      console.log("Read error: " + event.target.error);
    }
  };

  chunk_reader = function(_offset, _f) {
    var reader = new FileReader();
    var blob = _f.slice(_offset, chunk_size + _offset);
    reader.readAsArrayBuffer(blob);
    reader.onload = large_reader_onload;
    reader.onerror = e => {
      console.log("Read error");
      console.log(e);
    };
  };

  chunk_reader(offset, f);
};

export const saveFile = (projectId, newFile, closeModal) => dispatch => {
  delete newFile["f"];

  axios
    .post(`/api/v1/${projectId}/uploaded/files`, newFile)
    .then(res => {
      closeModal();
      dispatch({
        type: RESET_UPLOAD_STATE
      });
      dispatch({
        type: ADD_UPLOADED_FILE,
        newFile: res.data
      });
    })
    .catch(error => {
      toast.error("Add file problem. " + error, {
        autoClose: 8000,
        hideProgressBar: true,
        newsetOnTop: true
      });
    });
};
