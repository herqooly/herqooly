import axios from "axios";
import { SET_SECRETS, ADD_SECRET, DELETE_SECRET } from "./SecretTypes";

import { toast } from "react-toastify";

export const getSecrets = (organizationSlug, projectId) => dispatch => {
  axios
    .get(`/api/v1/${organizationSlug}/${projectId}/secrets`)
    .then(res =>
      dispatch({
        type: SET_SECRETS,
        payload: res.data
      })
    )
    .catch(err => {
      dispatch({
        type: SET_SECRETS,
        payload: []
      });

      toast.error("Get Secrets problem. " + err, {
        autoClose: 8000,
        hideProgressBar: true,
        newsetOnTop: true
      });
    });
};

export const addSecret = (
  organizationSlug,
  projectId,
  secretData
) => dispatch => {
  axios
    .post(`/api/v1/${organizationSlug}/${projectId}/secrets`, secretData)
    .then(res => {
      console.log(res);
      console.log(res.data);

      dispatch({ type: ADD_SECRET, payload: res.data });
    })
    .catch(err => {
      toast.error("Add secret problem. " + err, {
        autoClose: 8000,
        hideProgressBar: true,
        newsetOnTop: true
      });
    });
};

export const deleteSecret = (
  organizationSlug,
  projectId,
  secretId
) => dispatch => {
  axios
    .delete(`/api/v1/${organizationSlug}/${projectId}/secrets/${secretId}`)
    .then(res => {
      dispatch({
        type: DELETE_SECRET,
        payload: secretId
      });
    })
    .catch(err => {
      toast.error("Delete secret problem. " + err, {
        autoClose: 8000,
        hideProgressBar: true,
        newsetOnTop: true
      });
    });
};
