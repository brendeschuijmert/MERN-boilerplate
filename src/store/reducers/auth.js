import { handleActions } from "redux-actions";
import { Success, Fail } from "utils/status";
import { SIGNIN, SIGNOUT, SIGNUP, UPDATE_PROFILE } from "store/constants";

const getInitialState = () => {
  let authInfo = JSON.parse(localStorage.getItem("auth_token") || "{}");

  const initialState = {
    status: "",
    error: null,
    me: null,
    token: null
  };

  return authInfo
    ? {
        ...initialState,
        token: authInfo.token,
        me: authInfo.info
      }
    : initialState;
};

export default handleActions(
  {
    [Success(SIGNIN)]: (state, { payload }) => ({
      ...state,
      token: payload.token,
      status: "SUCCESS",
      me: payload.info
    }),

    [Fail(SIGNIN)]: (state, { payload }) => ({
      ...state,
      token: null,
      status: "FAIL",
      me: null,
      error: payload
    }),

    [Success(SIGNUP)]: state => ({
      ...state,
      status: "SUCCESS",
      error: null
    }),

    [Fail(SIGNUP)]: (state, { payload }) => ({
      ...state,
      token: null,
      status: "FAIL",
      me: null,
      error: payload
    }),

    [Success(UPDATE_PROFILE)]: (state, { payload }) => ({
      ...state,
      token: payload.token,
      status: "SUCCESS",
      me: payload.info
    }),

    [Fail(UPDATE_PROFILE)]: (state, { payload }) => ({
      ...state,
      status: "FAIL",
      error: payload
    }),

    [SIGNOUT]: state => ({
      ...state,
      token: null,
      status: SIGNOUT,
      me: null,
      error: null
    })
  },
  getInitialState()
);
