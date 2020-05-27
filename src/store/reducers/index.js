import { combineReducers } from "redux";

import auth from "./auth";
import record from "./record";
import user from "./user";
import toast from "./toast";
import general from "./general";

const appReducer = combineReducers({
  auth,
  record,
  user,
  toast,
  general
});

const rootReducer = (state, action) => {
  if (action.type === "SIGNOUT") {
    return appReducer(undefined, action);
  }

  return appReducer(state, action);
};

export default rootReducer;
