import { SET_SECRETS, ADD_SECRET, DELETE_SECRET } from "./SecretTypes";

const initialState = {
  secrets: []
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_SECRETS:
      return {
        ...state,
        secrets: action.payload
      };
    case ADD_SECRET:
      return {
        ...state,
        secrets: [...state.secrets, action.payload]
      };
    case DELETE_SECRET:
      return {
        ...state,
        secrets: state.secrets.filter(
          (item, index) => item.id !== action.payload
        )
      };
    default:
      return state;
  }
}
