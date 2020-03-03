import { SET_PERIODIC_JOBS, UPDATE_PERIODIC_JOB } from "./PeriodicJobTypes";

const initialState = {
  periodicJobs: []
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_PERIODIC_JOBS:
      return {
        ...state,
        periodicJobs: action.payload
      };
    case UPDATE_PERIODIC_JOB:
      let pj = [];
      const updatedJob = action.payload;
      state.periodicJobs.forEach(job => {
        if (job.id === updatedJob.id) {
          pj.push(updatedJob);
        } else {
          pj.push(job);
        }
      });

      return {
        ...state,
        periodicJobs: pj
      };
    default:
      return state;
  }
}
