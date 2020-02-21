import axios from "axios";
import { push } from "connected-react-router";
import { toast } from "react-toastify";

import {
  GET_SCRIPTS,
  GET_SCRIPT,
  ADD_SCRIPT,
  DELETE_SCRIPT,
  SET_KERNEL_EXECUTION_STATE,
  SET_KERNEL,
  GET_LINKS
} from "./ScriptTypes";

export const getScripts = (organizationSlug, projectId) => dispatch => {
  axios
    .get(`/api/v1/${organizationSlug}/${projectId}/scripts`)
    .then(res => {
      dispatch({
        type: GET_SCRIPTS,
        payload: res.data
      });

      if (res.data.length > 0) {
        let redirectTo =
          "/" +
          organizationSlug +
          "/project/" +
          projectId +
          "/src/" +
          res.data[0].id;

        dispatch(push(redirectTo));
      }
    })
    .catch(err => {
      toast.error("Get scripts problem. " + err, {
        autoClose: 8000,
        hideProgressBar: true,
        newsetOnTop: true
      });
    });
};

export const addScript = (
  organizationSlug,
  projectId,
  scriptData
) => dispatch => {
  axios
    .post(`/api/v1/${organizationSlug}/${projectId}/scripts`, scriptData)
    .then(res => {
      dispatch({ type: ADD_SCRIPT, payload: res.data });

      let redirectTo =
        "/" +
        organizationSlug +
        "/project/" +
        projectId +
        "/src/" +
        res.data.id;

      dispatch(push(redirectTo));
    })
    .catch(err => {
      toast.error("Add script problem. " + err, {
        autoClose: 8000,
        hideProgressBar: true,
        newsetOnTop: true
      });
    });
};

export const getScript = (
  organizationSlug,
  projectId,
  scriptId
) => dispatch => {
  axios
    .get(`/api/v1/${organizationSlug}/${projectId}/scripts/${scriptId}`)
    .then(res => {
      dispatch({
        type: GET_SCRIPT,
        payload: res.data
      });
    })
    .catch(err => {
      toast.error("Get script problem. " + err, {
        autoClose: 8000,
        hideProgressBar: true,
        newsetOnTop: true
      });
    });
};

export const deleteScript = (
  organizationSlug,
  projectId,
  scriptId
) => dispatch => {
  axios
    .delete(
      `/api/v1/${organizationSlug}/projects/${projectId}/scripts/${scriptId}`
    )
    .then(res => {
      dispatch({
        type: DELETE_SCRIPT,
        payload: scriptId
      });
      let redirectTo =
        "/" + organizationSlug + "/project/" + projectId + "/src";
      dispatch(push(redirectTo));
    })
    .catch(err => {
      toast.error("Delete script problem. " + err, {
        autoClose: 8000,
        hideProgressBar: true,
        newsetOnTop: true
      });
    });
};

export const startKernel = (
  organizationSlug,
  projectId,
  scriptId
) => dispatch => {
  dispatch({
    type: SET_KERNEL_EXECUTION_STATE,
    payload: { scriptId: scriptId, execution_state: "starting" }
  });

  axios
    .post(`/api/v1/${organizationSlug}/${projectId}/${scriptId}/kernel`, {
      action: "start"
    })
    .then(res => {
      dispatch({
        type: SET_KERNEL,
        payload: { scriptId: scriptId, kernel: res.data }
      });
    })
    .catch(err => {
      toast.error("Start kernel problem. " + err, {
        autoClose: 8000,
        hideProgressBar: true,
        newsetOnTop: true
      });
    });
};

export const interruptKernel = (organizationSlug, projectId, scriptId) => (
  dispatch,
  getState
) => {
  dispatch({
    type: SET_KERNEL_EXECUTION_STATE,
    payload: { scriptId: scriptId, execution_state: "interrupting" }
  });

  axios
    .post(`/api/v1/${organizationSlug}/${projectId}/${scriptId}/kernel`, {
      action: "interrupt",
      kernelId: getState().scripts.kernels[scriptId].id
    })
    .then(res => {
      console.log("interrupt kernel");
      console.log(res.data);
      //dispatch({
      //  type: SET_KERNEL,
      //  payload: { scriptId: scriptId, kernel: res.data }
      //});
    })
    .catch(err => {
      toast.error("Interrupt kernel problem. " + err, {
        autoClose: 8000,
        hideProgressBar: true,
        newsetOnTop: true
      });
    });
};

export const restartKernel = (organizationSlug, projectId, scriptId) => (
  dispatch,
  getState
) => {
  dispatch({
    type: SET_KERNEL_EXECUTION_STATE,
    payload: { scriptId: scriptId, execution_state: "restarting" }
  });

  axios
    .post(`/api/v1/${organizationSlug}/${projectId}/${scriptId}/kernel`, {
      action: "restart",
      kernelId: getState().scripts.kernels[scriptId].id
    })
    .then(res => {
      console.log("restart kernel");
      console.log(res.data);
      //dispatch({
      //  type: SET_KERNEL,
      //  payload: { scriptId: scriptId, kernel: res.data }
      //});
    })
    .catch(err => {
      toast.error("Restart kernel problem. " + err, {
        autoClose: 8000,
        hideProgressBar: true,
        newsetOnTop: true
      });
    });
};

export const saveScript = (
  organizationSlug,
  projectId,
  scriptId,
  showNotification = true
) => (dispatch, getState) => {
  const { widgets } = getState().widgets;
  const { cells } = getState().cells;

  const scriptData = {
    widgets: widgets,
    cells: cells
  };

  axios
    .post(
      `/api/v1/${organizationSlug}/${projectId}/${scriptId}/save_script`,
      scriptData
    )
    .then(res => {
      if (showNotification) {
        toast.info("Script saved.", {
          autoClose: 2000,
          hideProgressBar: true,
          newsetOnTop: true
        });
      }
    })
    .catch(err => {
      toast.error("Save script problem. " + err, {
        autoClose: 8000,
        hideProgressBar: true,
        newsetOnTop: true
      });
    });
};

export const getLinks = scriptId => dispatch => {
  axios
    .get(`/api/v1/${scriptId}/links`)
    .then(res => {
      dispatch({ type: GET_LINKS, payload: res.data });
    })
    .catch(err => {
      toast.error("Get links problem. " + err, {
        autoClose: 8000,
        hideProgressBar: true,
        newsetOnTop: true
      });
    });
};
