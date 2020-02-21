import {
  GET_SCRIPTS,
  GET_SCRIPT,
  ADD_SCRIPT,
  DELETE_SCRIPT,
  SET_KERNEL,
  SET_KERNEL_EXECUTION_STATE,
  GET_LINKS
} from "./ScriptTypes";

const initialState = {
  scripts: [],
  script: {},
  kernels: {},
  links: []
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_LINKS:
      return {
        ...state,
        links: action.payload
      };
    case GET_SCRIPTS:
      return {
        ...state,
        scripts: action.payload
      };
    case GET_SCRIPT:
      return {
        ...state,
        script: action.payload
      };
    case ADD_SCRIPT:
      return {
        ...state,
        scripts: [...state.scripts, action.payload]
      };
    case DELETE_SCRIPT:
      return {
        ...state,
        scripts: state.scripts.filter(
          (item, index) => item.id !== action.payload
        ),
        script: {}
      };
    case SET_KERNEL:
      state.kernels[action.payload.scriptId] = action.payload.kernel;
      return {
        ...state,
        kernels: { ...state.kernels }
      };
    case SET_KERNEL_EXECUTION_STATE:
      const { scriptId, execution_state } = action.payload;
      if (state.kernels.hasOwnProperty(scriptId)) {
        state.kernels[scriptId].execution_state = execution_state;
      } else {
        state.kernels[scriptId] = { execution_state: execution_state };
      }

      return {
        ...state,
        kernels: state.kernels
      };
    default:
      return state;
  }
}
