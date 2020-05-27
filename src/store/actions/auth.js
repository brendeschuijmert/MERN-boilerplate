import { createAction } from "redux-actions";
import { SIGNIN, SIGNUP, UPDATE_PROFILE, SIGNOUT } from "store/constants";

export const signin = createAction(SIGNIN);
export const signup = createAction(SIGNUP);
export const updateProfile = createAction(UPDATE_PROFILE);

export const signout = createAction(SIGNOUT, () => {
  localStorage.removeItem("auth_token");
});

export default {
  signin,
  signup,
  updateProfile,
  signout
};
