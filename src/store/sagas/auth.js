import { takeLatest } from "redux-saga/effects";
import { SIGNIN, SIGNUP, UPDATE_PROFILE } from "store/constants";
import apiCall from "utils/apiCall";

const signin = apiCall({
  type: SIGNIN,
  method: "post",
  path: () => "/auth/login/",
  success: ({ data }) => {
    localStorage.setItem("auth_token", JSON.stringify(data));
  }
});

const signup = apiCall({
  type: SIGNUP,
  method: "post",
  path: () => "/auth/signup/",
  success: () => {
    localStorage.removeItem("auth_token");
  }
});

const updateProfile = apiCall({
  type: UPDATE_PROFILE,
  method: "put",
  path: () => "/auth/update/",
  success: ({ data }) => {
    localStorage.setItem("auth_token", JSON.stringify(data));
  }
});

export default function* rootSaga() {
  yield takeLatest(SIGNIN, signin);
  yield takeLatest(SIGNUP, signup);
  yield takeLatest(UPDATE_PROFILE, updateProfile);
}
