import axios from "axios";
import {
  PROJECTS_LOADING,
  GET_PROJECTS,
  ADD_PROJECT,
  DELETE_PROJECT,
  GET_ERROR,
  GET_PROJECT
} from "./ProjectListTypes";
import { push } from "connected-react-router";
import { toast } from "react-toastify";

export const getProjects = organizationSlug => dispatch => {
  dispatch(setProjectsLoading());

  axios
    .get(`/api/v1/${organizationSlug}/projects`)
    .then(res =>
      dispatch({
        type: GET_PROJECTS,
        payload: res.data
      })
    )
    .catch(err => {
      dispatch({
        type: GET_PROJECTS,
        payload: []
      });

      toast.error("Get projects problem. " + err, {
        autoClose: 8000,
        hideProgressBar: true,
        newsetOnTop: true
      });
    });
};

// Projects loading
export const setProjectsLoading = () => {
  return {
    type: PROJECTS_LOADING
  };
};

// Add project
export const addProject = projectData => dispatch => {
  dispatch(setProjectsLoading());

  axios
    .post(`/api/v1/personal/projects`, projectData)
    .then(res => {
      dispatch({ type: ADD_PROJECT, newProject: res.data });
      dispatch(openProject("personal", res.data.id));
    })
    .catch(err => {
      dispatch({ type: GET_ERROR });
      toast.error("Add project problem. " + err, {
        autoClose: 8000,
        hideProgressBar: true,
        newsetOnTop: true
      });
    });
};

// Delete project
export const deleteProject = (organizationSlug, projectId) => dispatch => {
  dispatch(setProjectsLoading());

  axios
    .delete(`/api/v1/${organizationSlug}/projects/${projectId}`)
    .then(res => {
      dispatch({
        type: DELETE_PROJECT,
        projectId: projectId
      });
    })
    .catch(err => {
      dispatch({ type: GET_ERROR });
      toast.error("Delete project problem. " + err, {
        autoClose: 8000,
        hideProgressBar: true,
        newsetOnTop: true
      });
    });
};


// Open project
export const openProject = (organizationSlug, projectId) => dispatch => {
  dispatch(push("/" + organizationSlug + "/project/" + projectId));
};


export const getProjectDetail = (organizationSlug, projectId) => dispatch => {
  axios
    .get(`/api/v1/${organizationSlug}/projects/${projectId}`) 
    .then(res => {
      dispatch({
        type: GET_PROJECT,
        payload: res.data
      });
    })
    .catch(err =>
      dispatch({
        type: GET_PROJECT,
        payload: {}
      })
    );
};
