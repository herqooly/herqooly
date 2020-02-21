import {isEmpty} from "../utils/Common";

import {
  SET_CURRENT_USER,
  UNSET_CURRENT_USER,
  SET_TOKEN
} from "./AuthTypes";

const initialState = {
  isAuthenticated: false,
  user: {},
  organization: {},
  jupyter: {},
  token: ""
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_TOKEN:
      return {
        ...state,
        token: action.payload
      };
    case SET_CURRENT_USER:
      return {
        ...state,
        isAuthenticated: !isEmpty(action.payload),
        user: action.payload["user"],
        organization: action.payload["organization"],
        jupyter: action.payload["jupyter"],
      };
    case UNSET_CURRENT_USER:
      return {
        ...state,
        isAuthenticated: false,
        user: {},
        organization: {},
        jupyter: {},
        token: ""
      };
    default:
      return state;
  }
}
