import {
  PROJECTS_LOADING,
  GET_PROJECTS,
  ADD_PROJECT,
  DELETE_PROJECT,
  GET_ERROR,
  GET_PROJECT
} from "./ProjectListTypes";

const initialState = {
  projects: [],
  loading: false,
  project: {}
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_ERROR:
      return {
        ...state,
        loading: false
      };
    case PROJECTS_LOADING:
      return {
        ...state,
        loading: true
      };
    case GET_PROJECTS:
      return {
        ...state,
        projects: action.payload,
        loading: false
      };

    case ADD_PROJECT:
      return {
        ...state,
        projects: [...state.projects, action.newProject],
        loading: false
      };
    case DELETE_PROJECT:
      return {
        ...state,
        projects: state.projects.filter(
          (item, index) => item.id !== action.projectId
        ),
        loading: false
      };
    case GET_PROJECT:
      return {
        ...state,
        project: action.payload
      }
    
    default:
      return state;
  }
}
