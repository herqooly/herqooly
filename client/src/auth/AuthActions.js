import axios from "axios";
import {
  SET_CURRENT_USER,
  UNSET_CURRENT_USER,
  SET_TOKEN
} from "./AuthTypes";

export const setAxiosAuthToken = token => {
  if (typeof token !== "undefined" && token) {
    // Apply for every request
    axios.defaults.headers.common["Authorization"] = "Token " + token;
  } else {
    // Delete auth header
    delete axios.defaults.headers.common["Authorization"];
  }
};

export const setCurrentUser = (user, organization, jupyter) => dispatch => {
  localStorage.setItem("user", JSON.stringify(user));
  localStorage.setItem("organization", JSON.stringify(organization));
  localStorage.setItem("jupyter", JSON.stringify(jupyter));
  dispatch({
    type: SET_CURRENT_USER,
    payload: {
      user: user,
      organization: organization,
      jupyter: jupyter
    }
  });
};

export const setToken = token => dispatch => {
  dispatch({
    type: SET_TOKEN,
    payload: token
  });
};

export const unsetCurrentUser = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("organization");
  localStorage.removeItem("jupyter");
  return {
    type: UNSET_CURRENT_USER
  };
};

export const connectToMLJARSever = () => dispatch => {
  console.log("Connect to MLJAR Studio server")
  const auth_token = "dummy_token";
  setAxiosAuthToken(auth_token);
  axios
    .get("/api/v1/users/me/")
    .then(res => {
      dispatch(setToken(auth_token));    
      dispatch(setCurrentUser(res.data["user"], res.data["organizations"][0], res.data["jupyter"]));
    })
    .catch(err =>
       dispatch(unsetCurrentUser())
    );
};

