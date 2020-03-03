import axios from "axios";
import { SET_PERIODIC_JOBS, UPDATE_PERIODIC_JOB } from "./PeriodicJobTypes";

import { toast } from "react-toastify";

export const getPeriodicJobs = (organizationSlug, projectId) => dispatch => {
  axios
    .get(`/api/v1/${organizationSlug}/${projectId}/periodic_jobs`)
    .then(res =>
      dispatch({
        type: SET_PERIODIC_JOBS,
        payload: res.data
      })
    )
    .catch(err => {
      dispatch({
        type: SET_PERIODIC_JOBS,
        payload: []
      });

      toast.error("Get Periodic Jobs problem. " + err, {
        autoClose: 8000,
        hideProgressBar: true,
        newsetOnTop: true
      });
    });
};

export const updatePeriodicJob = (
  organizationSlug,
  projectId,
  scriptId,
  jobData
) => dispatch => {
  console.log("update");
  console.log(jobData);
  axios
    .patch(
      `/api/v1/${organizationSlug}/${projectId}/periodic_jobs/${scriptId}`,
      jobData
    )
    .then(res => {
      console.log("UPDATE");

      dispatch({
        type: UPDATE_PERIODIC_JOB,
        payload: res.data
      });
    })
    .catch(err => {
      toast.error("Update Periodic Job problem. " + err, {
        autoClose: 8000,
        hideProgressBar: true,
        newsetOnTop: true
      });
    });
};
