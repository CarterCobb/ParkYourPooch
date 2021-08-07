import { combineReducers } from "redux";
import { ACTIONS } from "./userActions";
import { ls } from "../api/user";

const USER_INIT_STATE = ls.get("user");

const userReducer = (state = USER_INIT_STATE, action) => {
  switch (action.type) {
    case ACTIONS.SET_USER:
      if (action.payload) ls.set("user", JSON.stringify(action.payload));
      return action.payload;
    default:
      return state;
  }
};

export default combineReducers({ user: userReducer });
